export default function ErrorPage(){
    return(
      <div className="text-center items-center" style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" , borderRadius: 10, marginTop: 100}}>
    <h1 className="mb-4 text-6xl font-semibold text-red-500">Nothing</h1>
    <p className="mb-4 text-lg text-gray-600">Oops! Looks like you're lost.</p>
    <div className="animate-bounce">
      <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
      </svg>
    </div>
    <p className="mt-4 text-gray-600">Let's get you back <a href="/" className="text-blue-500">Home</a>.</p>
  </div>
    )
}