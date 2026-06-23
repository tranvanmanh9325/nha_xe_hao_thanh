import { useState, useEffect } from 'react';
import { fetchSettings } from '../../utils/settingsService';
import AuthModal from '../../components/b2c/AuthModal';
import GuestNavbar from '../../components/b2c/GuestNavbar';
import GuestFooter from '../../components/b2c/GuestFooter';
import { BriefcaseIcon, UsersIcon, AwardIcon, PhoneIcon } from 'lucide-react';
import { 
  SmileIcon, WalletIcon, LocationIcon 
} from '../../components/icons/CustomIcons';

const Careers = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchSettings();
        if (data) setSettings(data);
      } catch (error) {
        console.error("Lỗi khi tải cài đặt:", error);
      }
    };
    loadSettings();
  }, []);

  const benefits = [
    {
      icon: WalletIcon,
      title: 'Thu Nhập Hấp Dẫn',
      desc: 'Lương cứng cạnh tranh cộng thưởng chuyến, thưởng doanh thu và phụ cấp xăng xe, ăn ở rõ ràng.'
    },
    {
      icon: AwardIcon,
      title: 'Chế Độ Đầy Đủ',
      desc: 'Đóng BHXH, BHYT, BHTN theo quy định. Thưởng lễ Tết, lương tháng 13, chế độ hiếu hỉ, ốm đau.'
    },
    {
      icon: UsersIcon,
      title: 'Môi Trường Chuyên Nghiệp',
      desc: 'Làm việc trong môi trường thân thiện, hòa đồng. Được đào tạo bài bản về nghiệp vụ và giao tiếp.'
    },
    {
      icon: LocationIcon,
      title: 'Hỗ Trợ Chỗ Ở',
      desc: 'Có phòng nghỉ đầy đủ tiện nghi dành cho lái xe và phụ xe tại các bến bãi, trạm dừng nghỉ.'
    }
  ];

  const jobs = [
    {
      id: 1,
      title: 'Tài Xế Xe Khách (Hạng E)',
      salary: '15.000.000đ - 25.000.000đ',
      location: 'Hà Nội / Nghệ An',
      req: [
        'Có giấy phép lái xe hạng E trở lên.',
        'Kinh nghiệm lái xe khách tuyến cố định tối thiểu 2 năm.',
        'Sức khỏe tốt, không sử dụng chất kích thích.',
        'Thái độ phục vụ lịch sự, chu đáo với hành khách.'
      ]
    },
    {
      id: 2,
      title: 'Nhân Viên Phục Vụ Trên Xe (Lơ Xe)',
      salary: '8.000.000đ - 12.000.000đ',
      location: 'Theo tuyến đường',
      req: [
        'Nam/Nữ từ 18 - 35 tuổi, sức khỏe tốt.',
        'Nhanh nhẹn, trung thực, giao tiếp tốt.',
        'Hỗ trợ hành khách lên xuống xe, sắp xếp hành lý.',
        'Không yêu cầu kinh nghiệm (sẽ được đào tạo).'
      ]
    },
    {
      id: 3,
      title: 'Nhân Viên Phòng Vé & CSKH',
      salary: '7.000.000đ - 10.000.000đ',
      location: 'Văn phòng Hà Nội / Vinh',
      req: [
        'Tốt nghiệp THPT trở lên. Sử dụng máy tính cơ bản.',
        'Giọng nói chuẩn, không nói ngọng, giao tiếp khéo léo.',
        'Tư vấn lịch trình, bán vé và giải đáp thắc mắc khách hàng.',
        'Chấp nhận làm việc theo ca.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      <GuestNavbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-brand-600">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-slide-up">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6 backdrop-blur-md border border-white/20">
            <BriefcaseIcon className="text-white w-6 h-6 mr-2" />
            <span className="text-white font-semibold tracking-wide">Tuyển Dụng</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-md leading-tight">
            Gia Nhập Đại Gia Đình <br className="hidden md:block"/>
            <span className="text-amber-300">Hào Thanh</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-100 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            Chúng tôi luôn tìm kiếm những con người tận tâm, nhiệt huyết để cùng nhau xây dựng dịch vụ vận tải hành khách số 1 Việt Nam.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-600 tracking-widest uppercase mb-2">Quyền Lợi Của Bạn</h2>
            <h3 className="text-3xl font-bold text-neutral-900">Tại Sao Chọn Làm Việc Tại Hào Thanh?</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="bg-neutral-50 rounded-2xl p-8 border border-neutral-100 hover:border-brand-300 transition-colors duration-300 group">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-brand-500 mb-6 shadow-sm group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-bold text-neutral-900 mb-3">{benefit.title}</h4>
                  <p className="text-neutral-500 leading-relaxed text-sm">
                    {benefit.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Jobs Section */}
      <section className="py-20 bg-neutral-50 border-t border-neutral-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Vị Trí Đang Tuyển Dụng</h2>
            <p className="text-neutral-500">Đừng bỏ lỡ cơ hội phát triển nghề nghiệp tại môi trường làm việc năng động.</p>
          </div>

          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-200 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-brand-600 mb-2">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                      <span className="flex items-center text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        <WalletIcon className="w-4 h-4 mr-1.5" />
                        {job.salary}
                      </span>
                      <span className="flex items-center text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full">
                        <LocationIcon className="w-4 h-4 mr-1.5" />
                        {job.location}
                      </span>
                    </div>
                  </div>
                  <a href="#apply" className="shrink-0 px-6 py-2.5 bg-brand-50 text-brand-600 font-bold rounded-xl border border-brand-200 hover:bg-brand-500 hover:text-white transition-colors text-center">
                    Ứng tuyển ngay
                  </a>
                </div>
                
                <div className="border-t border-neutral-100 pt-6">
                  <h4 className="font-semibold text-neutral-900 mb-3 flex items-center">
                    <SmileIcon className="w-5 h-5 mr-2 text-brand-500" />
                    Yêu cầu công việc:
                  </h4>
                  <ul className="space-y-2">
                    {job.req.map((r, i) => (
                      <li key={i} className="flex items-start text-neutral-600 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 mr-3 shrink-0"></span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section id="apply" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center text-brand-500 mx-auto mb-6">
            <PhoneIcon className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Cách Thức Ứng Tuyển</h2>
          <p className="text-lg text-neutral-600 mb-8">
            Ứng viên quan tâm vui lòng liên hệ trực tiếp phòng Nhân sự hoặc gửi hồ sơ qua email.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex items-center p-4 bg-neutral-50 rounded-xl border border-neutral-200 w-full md:w-auto">
              <div className="w-12 h-12 bg-brand-500 rounded-lg flex items-center justify-center text-white mr-4">
                <PhoneIcon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-sm text-neutral-500 font-semibold">Hotline Tuyển Dụng</p>
                <p className="text-xl font-bold text-neutral-900">{settings?.hotline || '0987.654.321'}</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-neutral-50 rounded-xl border border-neutral-200 w-full md:w-auto">
              <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center text-white mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div className="text-left">
                <p className="text-sm text-neutral-500 font-semibold">Email Nhận CV</p>
                <p className="text-xl font-bold text-neutral-900">hr@haothanh.vn</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GuestFooter settings={settings} />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Careers;