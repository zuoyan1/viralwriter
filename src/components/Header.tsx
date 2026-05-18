export function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">V</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ViralWriter</h1>
              <p className="text-xs text-gray-500">短视频文案智能评估系统</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm text-gray-600">AI驱动 · 数据支撑</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600">系统正常</span>
          </div>
        </div>
      </div>
    </header>
  );
}
