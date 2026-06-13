import { useState } from 'react';
import AuthModal from '../../components/b2c/AuthModal';
import { 
  LocationIcon, DateIcon, BusIcon, WifiIcon, VipSeatIcon, PhoneIcon,
  SearchIcon, WalletIcon, SmileIcon, StarIcon, PlusIcon, MinusIcon
} from '../../components/icons/CustomIcons';

const GuestHomepage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const popularRoutes = [
    { id: 1, from: 'Hà Nội', to: 'Vinh', price: '250.000đ', time: '6h00', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=800&auto=format&fit=crop' },
    { id: 2, from: 'Hà Nội', to: 'Đà Nẵng', price: '450.000đ', time: '14h00', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=800&auto=format&fit=crop' },
    { id: 3, from: 'Vinh', to: 'Huế', price: '300.000đ', time: '8h00', image: 'https://images.unsplash.com/photo-1610488427954-2bc5527a4697?q=80&w=800&auto=format&fit=crop' },
    { id: 4, from: 'Hà Nội', to: 'Sapa', price: '350.000đ', time: '6h30', image: 'https://images.unsplash.com/photo-1595844730298-b960fad9733c?q=80&w=800&auto=format&fit=crop' },
  ];

  const bookingSteps = [
    { icon: SearchIcon, title: 'Tìm chuyến xe', desc: 'Nhập điểm đi, điểm đến và ngày khởi hành để tìm chuyến phù hợp.' },
    { icon: VipSeatIcon, title: 'Chọn chỗ & Tiện ích', desc: 'Lựa chọn vị trí ghế yêu thích trên sơ đồ xe trực quan.' },
    { icon: WalletIcon, title: 'Thanh toán an toàn', desc: 'Thanh toán qua VNPay, MoMo, thẻ ngân hàng hoặc tại quầy.' },
    { icon: SmileIcon, title: 'Tận hưởng hành trình', desc: 'Nhận vé điện tử và lên xe tận hưởng chuyến đi thoải mái.' },
  ];

  const testimonials = [
    { id: 1, name: 'Nguyễn Minh Tuấn', rating: 5, text: 'Xe rất sạch sẽ, ghế nằm êm ái. Tài xế lái cẩn thận, đúng giờ. Chắc chắn sẽ quay lại lần sau!', initials: 'NT' },
    { id: 2, name: 'Trần Thị Hương', rating: 5, text: 'Đặt vé online rất tiện lợi, được chọn chỗ ngồi luôn. Wifi mạnh, có sạc điện thoại. Rất hài lòng!', initials: 'TH' },
    { id: 3, name: 'Lê Văn Đức', rating: 4, text: 'Phòng chờ thoáng mát, nhân viên nhiệt tình. Xe Limousine mới và đẹp. Giá cả hợp lý so với chất lượng.', initials: 'LĐ' },
  ];

  const faqItems = [
    { 
      question: 'Chính sách hoàn hủy vé như thế nào?', 
      answer: 'Quý khách có thể hủy vé miễn phí trước 24 giờ khởi hành. Hủy trong khoảng 12-24h trước giờ khởi hành sẽ chịu phí 20%. Hủy dưới 12h trước giờ khởi hành sẽ chịu phí 50%. Không hoàn tiền nếu hủy sau giờ khởi hành.' 
    },
    { 
      question: 'Số kg hành lý miễn phí là bao nhiêu?', 
      answer: 'Mỗi hành khách được mang theo miễn phí 20kg hành lý ký gửi và 7kg hành lý xách tay. Hành lý quá cân sẽ được tính phí 10.000đ/kg. Các vật phẩm cồng kềnh vui lòng liên hệ hotline trước khi đặt vé.' 
    },
    { 
      question: 'Xe có đón tận nhà không?', 
      answer: 'Có, Hào Thanh hỗ trợ đón/trả tận nơi trong nội thành Hà Nội và TP Vinh với phí 30.000đ. Quý khách vui lòng đặt dịch vụ trung chuyển khi mua vé hoặc gọi hotline ít nhất 2 giờ trước giờ khởi hành.' 
    },
    { 
      question: 'Quy định mang thú cưng lên xe?', 
      answer: 'Vì sự thoải mái và an toàn cho tất cả hành khách, Hào Thanh hiện chưa hỗ trợ vận chuyển thú cưng trên các chuyến xe khách. Quý khách có thể tham khảo dịch vụ vận chuyển thú cưng chuyên dụng của các đối tác chúng tôi.' 
    },
    { 
      question: 'Trẻ em dưới mấy tuổi được miễn phí vé?', 
      answer: 'Trẻ em dưới 6 tuổi được miễn phí vé nếu ngồi cùng ghế với người lớn đi kèm (tối đa 1 trẻ/1 người lớn). Trẻ từ 6 tuổi trở lên mua vé như người lớn và được bố trí ghế riêng.' 
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white">
                <BusIcon className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-brand-600 tracking-tight">HÀO THANH</span>
            </div>

            {/* Navigation (Desktop) */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-brand-600 font-semibold">Trang chủ</a>
              <a href="#" className="text-neutral-600 hover:text-brand-500 font-medium transition-colors">Lịch trình</a>
              <a href="#" className="text-neutral-600 hover:text-brand-500 font-medium transition-colors">Tra cứu vé</a>
              <a href="#" className="text-neutral-600 hover:text-brand-500 font-medium transition-colors">Khuyến mãi</a>
            </nav>

            {/* Login Button */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden md:block px-4 py-2 text-brand-600 font-semibold hover:bg-brand-50 rounded-lg transition-colors"
              >
                Đăng nhập
              </button>
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-md shadow-brand-500/20 transition-all hover:shadow-brand-500/40 active:scale-95"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" 
            alt="Bus travelling" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-neutral-900/60 bg-gradient-to-t from-neutral-900/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-md">
            Hành Trình Trọn Vẹn<br/>
            <span className="text-brand-400">Trải Nghiệm Chuẩn 5 Sao</span>
          </h1>
          <p className="text-lg text-neutral-200 mb-12 max-w-2xl mx-auto">
            Hệ thống đặt vé xe khách trực tuyến hàng đầu. Xe giường nằm cao cấp, đội ngũ chuyên nghiệp, an toàn trên mọi nẻo đường.
          </p>
        </div>
      </section>

      {/* Search Bar Widget (Overlapping Hero) */}
      <section className="relative z-20 -mt-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl shadow-neutral-200/50 p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-end">
            {/* Nơi đi */}
            <div className="relative">
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Điểm đi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-500">
                  <LocationIcon className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  placeholder="Ví dụ: Hà Nội" 
                  className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium text-lg transition-all"
                />
              </div>
            </div>
            
            {/* Nơi đến */}
            <div className="relative">
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Điểm đến</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-500">
                  <LocationIcon className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  placeholder="Ví dụ: Vinh" 
                  className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium text-lg transition-all"
                />
              </div>
            </div>

            {/* Ngày đi */}
            <div className="relative">
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Ngày đi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-500">
                  <DateIcon className="w-5 h-5" />
                </div>
                <input 
                  type="date" 
                  className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium text-lg transition-all"
                />
              </div>
            </div>

            {/* Button */}
            <div>
              <button className="w-full h-[54px] bg-brand-500 hover:bg-brand-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-brand-500/30 transition-all hover:shadow-brand-500/50 active:scale-[0.98] flex items-center justify-center space-x-2">
                <span>TÌM CHUYẾN</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Tuyến Đường Phổ Biến</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">Khám phá những điểm đến được yêu thích nhất cùng dịch vụ xe VIP chất lượng cao.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {popularRoutes.map((route) => (
            <div key={route.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={route.image} 
                  alt={`${route.from} đi ${route.to}`} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-brand-600">
                  {route.price}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-neutral-900 mb-1 group-hover:text-brand-600 transition-colors">
                  {route.from} <span className="text-neutral-400 mx-1">→</span> {route.to}
                </h3>
                <div className="flex items-center text-neutral-500 mb-4 mt-auto">
                  <DateIcon className="w-4 h-4 mr-1.5" />
                  <span className="text-sm">Thời gian: {route.time}</span>
                </div>
                <button className="w-full py-2.5 bg-brand-50 hover:bg-brand-500 text-brand-600 hover:text-white font-semibold rounded-lg transition-colors border border-brand-100 hover:border-brand-500">
                  Đặt vé ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-20 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Vì Sao Chọn Hào Thanh?</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">Chúng tôi cam kết mang lại trải nghiệm tốt nhất cho mỗi chuyến đi của bạn.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-500 mb-6 transform hover:-translate-y-2 transition-transform duration-300">
                <VipSeatIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Ghế Massage VIP</h3>
              <p className="text-neutral-500 leading-relaxed">Khoang cabin riêng biệt, ghế bọc da cao cấp tích hợp massage đa điểm, chống say xe hiệu quả.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-500 mb-6 transform hover:-translate-y-2 transition-transform duration-300">
                <WifiIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Tiện Ích Giải Trí</h3>
              <p className="text-neutral-500 leading-relaxed">Wifi tốc độ cao miễn phí, màn hình LCD riêng từng ghế, cổng sạc USB tiện lợi suốt hành trình.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-500 mb-6 transform hover:-translate-y-2 transition-transform duration-300">
                <BusIcon className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Đội Xe Đời Mới</h3>
              <p className="text-neutral-500 leading-relaxed">100% xe Limousine nhập khẩu nguyên chiếc. Bảo dưỡng định kỳ chuẩn quốc tế, tài xế kinh nghiệm.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Book - Step by Step */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Đặt Vé Chỉ Trong 4 Bước</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">Quy trình đặt vé online đơn giản, nhanh chóng — chưa đầy 2 phút là bạn đã có vé trong tay.</p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            {/* Dashed connector line (Desktop only) */}
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 border-t-2 border-dashed border-brand-200 z-0"></div>

            {bookingSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={index} className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-white border-2 border-brand-200 rounded-full flex items-center justify-center text-brand-500 mb-6 shadow-md hover:shadow-lg hover:border-brand-500 transition-all duration-300 group">
                    <StepIcon className="w-10 h-10 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="inline-block px-3 py-1 bg-brand-500 text-white text-xs font-bold rounded-full mb-3">Bước {index + 1}</span>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">{step.title}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Hành Khách Nói Gì Về Chúng Tôi?</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">Hơn 10.000 lượt đánh giá tích cực từ những hành khách đã trải nghiệm dịch vụ của Hào Thanh.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((review) => (
              <div key={review.id} className="bg-neutral-50 rounded-2xl p-8 border border-neutral-100 hover:shadow-lg transition-shadow duration-300 flex flex-col">
                {/* Star Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      className={`w-5 h-5 ${i < review.rating ? 'text-amber-400' : 'text-neutral-300'}`} 
                      filled={i < review.rating} 
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-neutral-600 leading-relaxed mb-6 flex-1 italic">"{review.text}"</p>

                {/* Reviewer Info */}
                <div className="flex items-center space-x-3 pt-4 border-t border-neutral-200">
                  <div className="w-11 h-11 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
                    {review.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">{review.name}</p>
                    <p className="text-xs text-neutral-400">Hành khách đã xác minh</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Câu Hỏi Thường Gặp</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">Tìm nhanh câu trả lời cho những thắc mắc phổ biến nhất của hành khách.</p>
          </div>

          <div className="space-y-3">
            {faqItems.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className={`bg-white rounded-xl border transition-all duration-300 ${isOpen ? 'border-brand-200 shadow-md' : 'border-neutral-200 hover:border-neutral-300'}`}>
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                  >
                    <span className={`font-semibold transition-colors ${isOpen ? 'text-brand-600' : 'text-neutral-800'}`}>
                      {faq.question}
                    </span>
                    <span className={`ml-4 flex-shrink-0 p-1 rounded-full transition-all duration-300 ${isOpen ? 'bg-brand-50 text-brand-500 rotate-0' : 'bg-neutral-100 text-neutral-500 rotate-0'}`}>
                      {isOpen ? <MinusIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="px-6 pb-5 text-neutral-500 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer (Minimal) */}
      <footer className="bg-neutral-900 text-neutral-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white">
                <BusIcon className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">HÀO THANH</span>
            </div>
            <p className="mb-4 max-w-sm">Dịch vụ vận tải hành khách cao cấp tuyến Hà Nội - Nghệ An - Hà Tĩnh.</p>
            <div className="flex items-center space-x-2">
              <PhoneIcon className="w-4 h-4 text-brand-500" />
              <span className="text-white font-semibold">Hotline: 1900 xxxx</span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Về Chúng Tôi</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Giới thiệu</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Tuyển dụng</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Tin tức</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Hỗ Trợ</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Quy định chung</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Câu hỏi thường gặp</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-neutral-800 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Nhà Xe Hào Thanh. All rights reserved.</p>
        </div>
      </footer>

      {/* Auth Modal Integraton */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

    </div>
  );
};

export default GuestHomepage;
