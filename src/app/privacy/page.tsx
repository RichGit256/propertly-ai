export default function PrivacyPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-background text-foreground">
            <div className="max-w-3xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
                <p className="text-white/60">Last Updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-6 text-white/80 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us, such as when you create an account, upload images, or communicate with us. This may include your email address and payment information.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Information</h2>
                        <p>We use your information to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Data Security</h2>
                        <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access or disclosure.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Third-Party Services</h2>
                        <p>We may use third-party services (such as payment processors and AI providers) who may collect information as required to perform their functions.</p>
                    </section>
                </div>
            </div>
        </main>
    );
}
