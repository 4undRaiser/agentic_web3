export default function ChatLoading() {
    return (
      <main className="flex flex-col h-screen bg-[#f0f0f0] relative">
        <div className="fixed inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23311b92' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
  
        <div className="relative z-10 flex flex-col h-full items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-xl bg-gray-100 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] flex items-center justify-center">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#311b92] rounded-full border-t-transparent animate-spin"></div>
              </div>
            </div>
            <p className="text-lg font-medium text-gray-700">Loading chat...</p>
          </div>
        </div>
      </main>
    );
  } 