export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-5">
      <h1 className="text-9xl font-black text-gray-200 dark:text-gray-800">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">페이지를 찾을 수 없습니다</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2">요청하신 페이지가 존재하지 않거나 주소가 변경되었습니다.</p>
      <a href="/" className="mt-8 px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors">
        홈으로 돌아가기
      </a>
    </div>
  );
}
