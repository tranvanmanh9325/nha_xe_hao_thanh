import { useState, useEffect } from 'react';
import { fetchSettings } from '../../utils/settingsService';
import AuthModal from '../../components/b2c/AuthModal';
import GuestNavbar from '../../components/b2c/GuestNavbar';
import GuestFooter from '../../components/b2c/GuestFooter';
import { ShieldCheckIcon } from 'lucide-react';
import { 
  BusIcon, VipSeatIcon, 
  SmileIcon, StarIcon 
} from '../../components/icons/CustomIcons';

const AboutUs = () => {
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

  const coreValues = [
    {
      icon: ShieldCheckIcon,
      title: 'An Toàn Tuyệt Đối',
      description: 'Đội ngũ tài xế giàu kinh nghiệm, tuân thủ nghiêm ngặt các quy định an toàn giao thông. Xe luôn được bảo dưỡng định kỳ đạt chuẩn.'
    },
    {
      icon: VipSeatIcon,
      title: 'Tiện Nghi Cao Cấp',
      description: 'Hệ thống ghế giường nằm massage hiện đại, chăn gối sạch sẽ, mang lại cho bạn cảm giác thoải mái như ở nhà trên suốt hành trình.'
    },
    {
      icon: SmileIcon,
      title: 'Phục Vụ Tận Tâm',
      description: 'Đội ngũ nhân viên thân thiện, nhiệt tình hỗ trợ 24/7. Chúng tôi luôn lắng nghe để không ngừng cải thiện chất lượng dịch vụ.'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      <GuestNavbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" 
            alt="Hào Thanh Bus Team" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-neutral-900/70 bg-gradient-to-t from-neutral-900/90 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-slide-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-500/20 text-brand-300 font-semibold text-sm mb-6 border border-brand-500/30 backdrop-blur-sm">
            Về Chúng Tôi
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-md leading-tight">
            Nhà Xe Hào Thanh <br/>
            <span className="text-brand-400 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">Tận Tâm Để Nâng Tầm</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-200 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
            Trải qua nhiều năm hoạt động, Hào Thanh tự hào là người bạn đồng hành tin cậy, mang đến những chuyến đi an toàn, trọn vẹn cảm xúc cho hàng triệu hành khách.
          </p>
        </div>
      </section>

      {/* Về Chúng Tôi / Lịch Sử */}
      <section className="py-20 lg:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-brand-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
              <img 
                src="https://images.unsplash.com/photo-1557223562-6c77ef16210f?q=80&w=800&auto=format&fit=crop" 
                alt="Bus interior" 
                className="relative rounded-2xl shadow-2xl object-cover h-[500px] w-full transform transition-transform hover:scale-[1.02] duration-500"
              />
              {/* Badge */}
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl border border-neutral-100 hidden md:block">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center text-white">
                    <StarIcon size={32} className="fill-current text-amber-300" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-neutral-900">10+</p>
                    <p className="text-sm text-neutral-500 font-semibold uppercase tracking-wider">Năm Kinh Nghiệm</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div>
                <h2 className="text-sm font-bold text-brand-600 tracking-widest uppercase mb-2">Câu Chuyện Của Hào Thanh</h2>
                <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight">Khởi Nguồn Từ Chữ <span className="text-brand-500">"Tâm"</span></h3>
              </div>
              <div className="space-y-4 text-lg text-neutral-600 leading-relaxed font-light">
                <p>
                  Được thành lập với khát vọng thay đổi diện mạo ngành vận tải hành khách, <strong className="text-neutral-900 font-semibold">Nhà xe Hào Thanh</strong> bắt đầu hành trình từ những chiếc xe đầu tiên với cam kết duy nhất: Đặt sự an toàn và trải nghiệm của khách hàng lên hàng đầu.
                </p>
                <p>
                  Chúng tôi hiểu rằng, mỗi chuyến đi không chỉ đơn thuần là di chuyển từ điểm A đến điểm B, mà đó là hành trình trở về nhà, là những cuộc gặp gỡ quan trọng, hay những chuyến du lịch đáng nhớ. Vì vậy, Hào Thanh luôn nỗ lực không ngừng nghỉ để trang bị dàn xe Limousine đời mới nhất cùng quy trình kiểm tra chất lượng khắt khe.
                </p>
                <p>
                  Sứ mệnh của chúng tôi là xóa bỏ nỗi ám ảnh "say xe, nhồi nhét", mang lại một không gian di chuyển văn minh, lịch sự và đẳng cấp chuẩn 5 sao.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Giá trị cốt lõi */}
      <section className="py-20 lg:py-28 bg-neutral-50 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-brand-600 tracking-widest uppercase mb-2">Cam Kết Chất Lượng</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-neutral-900">Giá Trị Cốt Lõi</h3>
            <div className="w-24 h-1 bg-brand-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {coreValues.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="bg-white rounded-3xl p-10 shadow-sm border border-neutral-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
                  <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-8 group-hover:scale-110 transition-transform duration-300 group-hover:bg-brand-500 group-hover:text-white">
                    <Icon size={40} strokeWidth={1.5} />
                  </div>
                  <h4 className="text-2xl font-bold text-neutral-900 mb-4">{value.title}</h4>
                  <p className="text-neutral-500 leading-relaxed font-light text-lg">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Thống kê / Nổi bật */}
      <section className="py-16 bg-brand-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-brand-400/30">
            <div className="p-4">
              <p className="text-4xl md:text-5xl font-extrabold text-white mb-2">1M+</p>
              <p className="text-brand-100 font-medium">Hành Khách Tin Chọn</p>
            </div>
            <div className="p-4">
              <p className="text-4xl md:text-5xl font-extrabold text-white mb-2">50+</p>
              <p className="text-brand-100 font-medium">Đầu Xe Đời Mới</p>
            </div>
            <div className="p-4">
              <p className="text-4xl md:text-5xl font-extrabold text-white mb-2">5</p>
              <p className="text-brand-100 font-medium">Năm Liền Đạt Chuẩn</p>
            </div>
            <div className="p-4">
              <p className="text-4xl md:text-5xl font-extrabold text-white mb-2">24/7</p>
              <p className="text-brand-100 font-medium">Hỗ Trợ Tận Tình</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Bạn Đã Sẵn Sàng Cho Chuyến Đi Tới?</h2>
          <p className="text-xl text-neutral-500 mb-10 font-light">Trải nghiệm ngay dịch vụ chất lượng chuẩn 5 sao từ Hào Thanh.</p>
          <a href="/lich-trinh" className="inline-flex items-center px-8 py-4 bg-brand-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-600 transition-all hover:shadow-brand-500/50 hover:-translate-y-1">
            Đặt Vé Ngay Hôm Nay
            <BusIcon className="ml-3" size={24} />
          </a>
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

export default AboutUs;