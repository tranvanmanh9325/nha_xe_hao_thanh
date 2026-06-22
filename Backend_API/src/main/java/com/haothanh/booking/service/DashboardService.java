package com.haothanh.booking.service;

import com.haothanh.booking.dto.DashboardOverviewDTO;
import com.haothanh.booking.dto.DashboardTripDTO;
import com.haothanh.booking.dto.RevenueByRouteDTO;
import com.haothanh.booking.dto.RevenueByTimeDTO;
import com.haothanh.booking.dto.RevenueStatisticsDTO;
import com.haothanh.booking.dto.StatItemDTO;
import com.haothanh.booking.entity.Trip;
import com.haothanh.booking.repository.TicketRepository;
import com.haothanh.booking.repository.TripRepository;
import com.haothanh.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TicketRepository ticketRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public DashboardOverviewDTO getDashboardOverview() {
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC); // Can use system timezone if preferred
        OffsetDateTime startOfToday = now.truncatedTo(ChronoUnit.DAYS);
        OffsetDateTime endOfToday = startOfToday.plusDays(1).minusNanos(1);
        OffsetDateTime startOfYesterday = startOfToday.minusDays(1);
        OffsetDateTime endOfYesterday = startOfToday.minusNanos(1);

        // 1. Tickets Sold
        long ticketsToday = ticketRepository.countTicketsByDateRange(startOfToday, endOfToday);
        long ticketsYesterday = ticketRepository.countTicketsByDateRange(startOfYesterday, endOfYesterday);
        double ticketTrend = calculateTrend(ticketsToday, ticketsYesterday);

        // 2. Trips Departing
        long tripsToday = tripRepository.countTripsByDateRange(startOfToday, endOfToday);
        long tripsYesterday = tripRepository.countTripsByDateRange(startOfYesterday, endOfYesterday);
        double tripTrend = calculateTrend(tripsToday, tripsYesterday);

        // 3. Revenue
        BigDecimal revenueToday = ticketRepository.sumRevenueByDateRange(startOfToday, endOfToday);
        BigDecimal revenueYesterday = ticketRepository.sumRevenueByDateRange(startOfYesterday, endOfYesterday);
        double revenueTrend = calculateTrend(revenueToday.doubleValue(), revenueYesterday.doubleValue());

        // 4. New Customers
        long customersToday = userRepository.countUsersByDateRange(startOfToday, endOfToday);
        long customersYesterday = userRepository.countUsersByDateRange(startOfYesterday, endOfYesterday);
        double customerTrend = calculateTrend(customersToday, customersYesterday);

        List<StatItemDTO> stats = new ArrayList<>();
        stats.add(StatItemDTO.builder()
                .label("Vé bán hôm nay")
                .value(ticketsToday)
                .trend(round(ticketTrend, 1))
                .trendLabel("so với hôm qua")
                .build());
        
        stats.add(StatItemDTO.builder()
                .label("Chuyến sắp khởi hành")
                .value(tripsToday)
                .trend(round(tripTrend, 1))
                .trendLabel("chuyến hôm nay")
                .build());
                
        stats.add(StatItemDTO.builder()
                .label("Doanh thu hôm nay")
                .value(revenueToday)
                .trend(round(revenueTrend, 1))
                .trendLabel("so với hôm qua")
                .build());
                
        stats.add(StatItemDTO.builder()
                .label("Khách hàng mới")
                .value(customersToday)
                .trend(round(customerTrend, 1))
                .trendLabel("so với hôm qua")
                .build());

        // Upcoming trips
        List<Trip> trips = tripRepository.findWithBusByDepartureTimeGreaterThanEqualOrderByDepartureTimeAsc(now, org.springframework.data.domain.PageRequest.of(0, 8));
        List<String> paidStatuses = Arrays.asList("PAID", "PENDING", "paid", "unpaid");

        List<Long> tripIds = trips.stream().map(Trip::getId).collect(Collectors.toList());
        java.util.Map<Long, Long> bookedSeatsMap = new java.util.HashMap<>();
        if (!tripIds.isEmpty()) {
            List<Object[]> seatCounts = ticketRepository.countBookedSeatsByTripIds(tripIds, paidStatuses);
            for (Object[] row : seatCounts) {
                Long tripId = (Long) row[0];
                Long count = (Long) row[1];
                bookedSeatsMap.put(tripId, count);
            }
        }

        List<DashboardTripDTO> upcomingTrips = trips.stream().map(trip -> {
            long bookedSeats = bookedSeatsMap.getOrDefault(trip.getId(), 0L);
            String code = "HT-" + trip.getId(); // Example formatted code
            return DashboardTripDTO.builder()
                    .code(code)
                    .route(trip.getRoute())
                    .departureTime(trip.getDepartureTime())
                    .bookedSeats((int) bookedSeats)
                    .totalSeats(trip.getBus() != null ? trip.getBus().getTotalSeats() : 0)
                    .status(trip.getStatus())
                    .driver(trip.getDriver() != null ? trip.getDriver() : "Chưa xếp tài xế")
                    .build();
        }).collect(Collectors.toList());

        return DashboardOverviewDTO.builder()
                .stats(stats)
                .upcomingTrips(upcomingTrips)
                .build();
    }

    @Transactional(readOnly = true)
    public RevenueStatisticsDTO getRevenueStatistics(OffsetDateTime startDate, OffsetDateTime endDate) {
        long durationDays = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        OffsetDateTime prevStartDate = startDate.minusDays(durationDays);
        OffsetDateTime prevEndDate = startDate.minusNanos(1);

        // 1. Total Revenue
        BigDecimal currentRevenue = ticketRepository.sumRevenueByDateRange(startDate, endDate);
        BigDecimal prevRevenue = ticketRepository.sumRevenueByDateRange(prevStartDate, prevEndDate);
        double revenueTrend = calculateTrend(currentRevenue.doubleValue(), prevRevenue.doubleValue());

        // 2. Total Tickets
        long currentTickets = ticketRepository.countTicketsByDateRange(startDate, endDate);
        long prevTickets = ticketRepository.countTicketsByDateRange(prevStartDate, prevEndDate);
        double ticketsTrend = calculateTrend(currentTickets, prevTickets);

        // 3. Cancellation Rate
        long currentCancelled = ticketRepository.countCancelledTicketsByDateRange(startDate, endDate);
        long prevCancelled = ticketRepository.countCancelledTicketsByDateRange(prevStartDate, prevEndDate);
        
        double currentCancelRate = currentTickets > 0 ? (double) currentCancelled / currentTickets * 100 : 0;
        double prevCancelRate = prevTickets > 0 ? (double) prevCancelled / prevTickets * 100 : 0;
        double cancelRateTrend = currentCancelRate - prevCancelRate; // percentage points difference

        // 4. Charts Data
        List<Object[]> revenueTimeData = ticketRepository.getRevenueByTimeNative(startDate, endDate);
        List<RevenueByTimeDTO> revenueByTime = revenueTimeData.stream().map(row -> {
            java.sql.Date date = (java.sql.Date) row[0];
            BigDecimal revenue = (BigDecimal) row[1];
            String formattedDate = new java.text.SimpleDateFormat("dd/MM").format(date);
            return RevenueByTimeDTO.builder()
                    .name(formattedDate)
                    .revenue(revenue)
                    .build();
        }).collect(Collectors.toList());

        List<Object[]> routeData = ticketRepository.getRevenueByRoute(startDate, endDate);
        BigDecimal totalRouteRevenue = routeData.stream()
                .map(row -> (BigDecimal) row[1])
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<RevenueByRouteDTO> revenueByRoute = routeData.stream().map(row -> {
            String route = (String) row[0];
            BigDecimal routeRevenue = (BigDecimal) row[1];
            double percentage = totalRouteRevenue.compareTo(BigDecimal.ZERO) > 0 
                    ? routeRevenue.doubleValue() / totalRouteRevenue.doubleValue() * 100 
                    : 0;
            return RevenueByRouteDTO.builder()
                    .name(route)
                    .revenue(routeRevenue)
                    .value(round(percentage, 1))
                    .build();
        }).collect(Collectors.toList());

        return RevenueStatisticsDTO.builder()
                .totalRevenue(StatItemDTO.builder()
                        .label("Tổng doanh thu")
                        .value(currentRevenue)
                        .trend(round(revenueTrend, 1))
                        .trendLabel("so với kỳ trước")
                        .build())
                .totalTickets(StatItemDTO.builder()
                        .label("Tổng số vé đã bán")
                        .value(currentTickets)
                        .trend(round(ticketsTrend, 1))
                        .trendLabel("so với kỳ trước")
                        .build())
                .cancellationRate(StatItemDTO.builder()
                        .label("Tỷ lệ hủy vé")
                        .value(round(currentCancelRate, 1))
                        .trend(round(cancelRateTrend, 1))
                        .trendLabel("so với kỳ trước")
                        .build())
                .revenueByTime(revenueByTime)
                .revenueByRoute(revenueByRoute)
                .build();
    }

    private double calculateTrend(double today, double yesterday) {
        if (yesterday == 0) {
            return today > 0 ? 100.0 : 0.0;
        }
        return ((today - yesterday) / yesterday) * 100.0;
    }

    private double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();
        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }
}