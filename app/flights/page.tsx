import FlightSearch from './FlightSearch';

export default async function FlightsPage() {
  return (
    <div className="font-sans text-gray-800 bg-white">
      {/* Banner Section */}
      <section className="relative min-h-[600px] md:min-h-[750px] flex flex-col items-center justify-start pt-0 pb-0 w-full">
        <img
          src="/assets/images/background3.png"
          alt="Flights Banner"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{objectPosition: 'center'}}
        />
      </section>
      {/* Search Form floating below banner */}
      <div className="w-full flex justify-center -mt-32 md:-mt-40 z-20 relative">
        <div className="bg-white rounded-[40px] shadow-xl p-8 md:p-12 border border-gray-100 w-full max-w-6xl flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center drop-shadow-lg">
            Mở cánh cửa khám phá cùng LetGoNow
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-6 text-center">
            LetGoNow - Đặt chân lên đỉnh mây với một bước nhảy
          </p>
          <FlightSearch />
        </div>
      </div>

      {/* Testimonials Section (reuse from homepage) */}
      <section className="max-w-7xl mx-auto py-32 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
          Đánh giá từ những người đã trải nghiệm
        </h2>
        <div className="flex flex-col items-center">
          <p className="text-gray-600 text-lg italic mb-4 max-w-2xl text-center">
            "Du thuyền 5 sao với sự trải nghiệm tuyệt vời. Tour câu cá cùng với đội ngũ hướng dẫn viên nhiệt tình, ăn uống ngon, uống rượu vang miễn phí. Đồ ăn khá đa dạng, nhiều lựa chọn để thử. Rất đáng để trải nghiệm!"
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Khách hàng chia sẻ về trải nghiệm tuyệt vời trên du thuyền du lịch vòng vịnh.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100">
              Chí Thu Hà
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100">
              Anh Khánh
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100">
              Chị Linh - Anh Định
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100">
              Bà Minh Hoang
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100">
              Cô Thanh Hằng và Bàn
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}