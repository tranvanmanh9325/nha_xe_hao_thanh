import { useState, useEffect } from 'react';
import { fetchSettings } from '../../utils/settingsService';
import AuthModal from '../../components/b2c/AuthModal';
import GuestNavbar from '../../components/b2c/GuestNavbar';
import GuestFooter from '../../components/b2c/GuestFooter';
import { NewspaperIcon, CalendarIcon, ChevronRightIcon, TagIcon, TrendingUpIcon } from 'lucide-react';

const News = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

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

  const categories = [
    { id: 'all', name: 'Tất cả tin tức' },
    { id: 'khuyen-mai', name: 'Khuyến mãi' },
    { id: 'tin-nha-xe', name: 'Tin nhà xe' },
    { id: 'cam-nang', name: 'Cẩm nang du lịch' }
  ];

  const newsArticles = [
    {
      id: 1,
      category: 'khuyen-mai',
      categoryName: 'Khuyến mãi',
      title: 'Flash Sale Cuối Tuần: Giảm 50% Tuyến Hà Nội - Nghệ An',
      excerpt: 'Săn ngay vé xe giường nằm massage cao cấp chỉ với nửa giá trong khung giờ vàng từ 12h - 14h cuối tuần này.',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop',
      date: '24/06/2026',
      featured: true
    },
    {
      id: 2,
      category: 'tin-nha-xe',
      categoryName: 'Tin nhà xe',
      title: 'Hào Thanh Khai Trương Dàn Siêu Xe Limousine 22 Phòng Đôi',
      excerpt: 'Nhằm nâng cao trải nghiệm khách hàng, Hào Thanh chính thức đưa vào hoạt động dòng xe Limousine phòng đôi đẳng cấp 5 sao.',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop',
      date: '20/06/2026',
      featured: false
    },
    {
      id: 3,
      category: 'cam-nang',
      categoryName: 'Cẩm nang du lịch',
      title: 'Kinh Nghiệm Đi Xe Khách Đường Dài Không Bị Say',
      excerpt: 'Lựa chọn vị trí ghế ngồi, chuẩn bị thuốc chống say và các mẹo vặt giúp bạn tận hưởng trọn vẹn chuyến đi.',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop',
      date: '15/06/2026',
      featured: false
    },
    {
      id: 4,
      category: 'khuyen-mai',
      categoryName: 'Khuyến mãi',
      title: 'Thanh Toán Qua VNPAY - Hoàn Tiền Lên Đến 100K',
      excerpt: 'Nhập mã HAOTHANHVNPAY để được giảm trực tiếp 10% (tối đa 100K) khi đặt vé và thanh toán qua ứng dụng ngân hàng.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop',
      date: '10/06/2026',
      featured: false
    },
    {
      id: 5,
      category: 'cam-nang',
      categoryName: 'Cẩm nang du lịch',
      title: 'Top 5 Đặc Sản Nghệ An Bạn Nhất Định Phải Thử',
      excerpt: 'Cùng Hào Thanh khám phá những món ăn trứ danh tại quê hương Bác như miến lươn, bánh mướt, súp lươn cay nồng.',
      image: 'https://images.unsplash.com/photo-1625938146369-adc83368bda7?q=80&w=800&auto=format&fit=crop',
      date: '05/06/2026',
      featured: false
    },
    {
      id: 6,
      category: 'tin-nha-xe',
      categoryName: 'Tin nhà xe',
      title: 'Lịch Trình Tăng Cường Phục Vụ Hành Khách Dịp Lễ 2/9',
      excerpt: 'Nhà xe Hào Thanh thông báo tăng cường thêm 20 chuyến xe mỗi ngày để đáp ứng nhu cầu đi lại tăng cao dịp Quốc Khánh.',
      image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop',
      date: '01/06/2026',
      featured: false
    }
  ];

  const filteredNews = activeCategory === 'all' 
    ? newsArticles 
    : newsArticles.filter(news => news.category === activeCategory);

  const featuredArticle = newsArticles.find(news => news.featured);
  const regularArticles = filteredNews.filter(news => !news.featured || activeCategory !== 'all');

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      <GuestNavbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />

      {/* Hero Header */}
      <section className="bg-brand-600 pt-32 pb-16 lg:pt-40 lg:pb-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
           <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="dotted-pattern" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="currentColor"></circle></pattern></defs><rect width="100%" height="100%" fill="url(#dotted-pattern)"></rect></svg>
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6 backdrop-blur-md border border-white/20">
            <NewspaperIcon className="text-white w-6 h-6 mr-2" />
            <span className="text-white font-semibold tracking-wide">Tin tức & Sự kiện</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Cập Nhật Thông Tin Mới Nhất</h1>
          <p className="text-brand-100 text-lg max-w-2xl mx-auto">
            Đừng bỏ lỡ các chương trình khuyến mãi hấp dẫn, tin tức nội bộ và cẩm nang du lịch hữu ích từ nhà xe Hào Thanh.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-20">
        
        {/* Category Tabs */}
        <div className="bg-white rounded-2xl shadow-lg shadow-neutral-200/50 p-2 md:p-4 flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-16 border border-neutral-100">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeCategory === cat.id 
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30' 
                  : 'bg-transparent text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Featured Article (Only show on 'all' tab) */}
        {activeCategory === 'all' && featuredArticle && (
          <div className="mb-16 bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex flex-col lg:flex-row">
            <div className="lg:w-3/5 relative overflow-hidden">
              <img 
                src={featuredArticle.image} 
                alt={featuredArticle.title} 
                className="w-full h-[300px] lg:h-[450px] object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center shadow-lg animate-pulse">
                <TrendingUpIcon className="w-4 h-4 mr-1" /> HOT
              </div>
            </div>
            <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-brand-600 bg-brand-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {featuredArticle.categoryName}
                </span>
                <span className="text-neutral-400 text-sm flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1.5" />
                  {featuredArticle.date}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-4 leading-tight group-hover:text-brand-600 transition-colors">
                {featuredArticle.title}
              </h2>
              <p className="text-neutral-500 text-lg leading-relaxed mb-8">
                {featuredArticle.excerpt}
              </p>
              <button className="inline-flex items-center text-brand-600 font-bold group/btn">
                Đọc tiếp 
                <ChevronRightIcon className="w-5 h-5 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer flex flex-col">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold text-white shadow-md ${
                    article.category === 'khuyen-mai' ? 'bg-amber-500' :
                    article.category === 'tin-nha-xe' ? 'bg-brand-500' : 'bg-emerald-500'
                  }`}>
                    {article.categoryName}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center text-neutral-400 text-sm mb-3">
                  <CalendarIcon className="w-4 h-4 mr-1.5" />
                  {article.date}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-brand-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                  {article.excerpt}
                </p>
                <div className="border-t border-neutral-100 pt-4 mt-auto">
                  <span className="inline-flex items-center text-brand-600 font-semibold text-sm group/btn">
                    Xem chi tiết
                    <ChevronRightIcon className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination placeholder */}
        {filteredNews.length > 0 && (
          <div className="mt-16 flex justify-center space-x-2">
            <button className="w-10 h-10 rounded-xl bg-white border border-neutral-200 text-neutral-500 flex items-center justify-center hover:bg-neutral-50 transition-colors cursor-not-allowed opacity-50">
              <ChevronRightIcon className="w-5 h-5 rotate-180" />
            </button>
            <button className="w-10 h-10 rounded-xl bg-brand-500 text-white font-bold flex items-center justify-center shadow-md">
              1
            </button>
            <button className="w-10 h-10 rounded-xl bg-white border border-neutral-200 text-neutral-600 font-semibold flex items-center justify-center hover:bg-neutral-50 transition-colors">
              2
            </button>
            <button className="w-10 h-10 rounded-xl bg-white border border-neutral-200 text-neutral-600 flex items-center justify-center hover:bg-neutral-50 transition-colors">
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        {filteredNews.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-neutral-100">
            <TagIcon className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">Chưa có bài viết nào</h3>
            <p className="text-neutral-500">Chuyên mục này hiện chưa có bài viết. Vui lòng quay lại sau.</p>
          </div>
        )}

      </section>

      <GuestFooter settings={settings} />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default News;