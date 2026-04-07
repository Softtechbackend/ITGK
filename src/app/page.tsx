export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container py-20">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-foreground">
            PMSURYAGHAR ROOFTOP SOLAR SCHEME
          </h1>
          <p className="text-lg text-neutral-600">
            Management System for Solar Installation Services
          </p>
          <div className="flex gap-4 justify-center pt-8">
            <button className="btn-primary">
              Register as Partner
            </button>
            <button className="btn-outline">
              Login
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
