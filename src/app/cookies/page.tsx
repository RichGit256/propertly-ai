export default function CookiesPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-background text-foreground">
            <div className="max-w-3xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold text-white">Cookie Policy</h1>
                <p className="text-white/60">Last Updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-6 text-white/80 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. What Are Cookies</h2>
                        <p>Cookies are small text files that are stored on your device when you visit a website. They help us remember your preferences and improve your user experience.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Cookies</h2>
                        <p>We use cookies to authenticate users, prevent fraud, and analyze how our service is used. Essential cookies are required for the site to function properly.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Managing Cookies</h2>
                        <p>You can control and manage cookies through your browser settings. However, disabling cookies may affect the functionality of our website.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Changes to This Policy</h2>
                        <p>We may update this policy from time to time. We encourage you to review this page periodically for any changes.</p>
                    </section>
                </div>
            </div>
        </main>
    );
}
