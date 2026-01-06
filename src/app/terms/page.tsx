export default function TermsPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-background text-foreground">
            <div className="max-w-3xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
                <p className="text-white/60">Last Updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-6 text-white/80 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                        <p>Welcome to Propertly.ai. By accessing our website and using our AI enhancement services, you agree to be bound by these Terms of Service.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Use of Services</h2>
                        <p>You agree to use our services only for lawful purposes. You represent that you have the right to upload and edit any content you submit to our platform.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Intellectual Property</h2>
                        <p>You retain all rights to the images you upload. By using our service, you grant us a license to process these images solely for the purpose of providing the enhancement service.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Limitation of Liability</h2>
                        <p>Propertly.ai is provided "as is". We are not liable for any damages arising from the use of our service, including but not limited to direct, indirect, incidental, or consequential damages.</p>
                    </section>
                </div>
            </div>
        </main>
    );
}
