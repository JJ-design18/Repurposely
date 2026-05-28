import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { Zap } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      <div className="pt-28 pb-20 px-6 max-w-3xl mx-auto flex-1">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-6">
            <Zap className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-foreground/50 text-sm">Last updated: May 28, 2026</p>
        </div>

        <div className="space-y-8">
          <Section title="What We Collect">
            <p>When you use Repurposely, we collect:</p>
            <ul>
              <li><strong>Account info:</strong> Your email address and password when you sign up.</li>
              <li><strong>YouTube URLs:</strong> The video links you submit for repurposing.</li>
              <li><strong>Generated content:</strong> The content our AI creates for you, stored in your account history.</li>
              <li><strong>Usage data:</strong> How many generations you&apos;ve used and your subscription plan.</li>
              <li><strong>Payment info:</strong> Processed securely through Stripe. We never see or store your full card number.</li>
            </ul>
          </Section>

          <Section title="What We Don't Collect">
            <ul>
              <li>We don&apos;t download or store YouTube videos. We only process the transcript text.</li>
              <li>We don&apos;t track you across other websites.</li>
              <li>We don&apos;t sell your data to third parties. Ever.</li>
              <li>We don&apos;t use your content to train AI models.</li>
            </ul>
          </Section>

          <Section title="How We Use Your Data">
            <ul>
              <li>To provide the service — extracting transcripts and generating content.</li>
              <li>To save your generation history so you can access it later.</li>
              <li>To manage your subscription and billing.</li>
              <li>To send you important account-related emails (password resets, billing issues).</li>
              <li>To improve the product based on aggregate usage patterns (not individual content).</li>
            </ul>
          </Section>

          <Section title="Third-Party Services">
            <p>We use the following services to operate Repurposely:</p>
            <ul>
              <li><strong>Supabase:</strong> Authentication and database hosting. Your data is stored securely on their servers.</li>
              <li><strong>OpenAI:</strong> AI content generation. Transcripts are sent to OpenAI&apos;s API for processing. OpenAI&apos;s data usage policy applies.</li>
              <li><strong>Stripe:</strong> Payment processing. Stripe handles all payment data securely.</li>
              <li><strong>Pexels:</strong> Stock footage for Production Kit videos. No user data is shared with Pexels.</li>
            </ul>
          </Section>

          <Section title="Data Security">
            <p>We take security seriously:</p>
            <ul>
              <li>All data is transmitted over SSL/TLS encrypted connections.</li>
              <li>Passwords are hashed — we can&apos;t see them.</li>
              <li>Database access is protected by Row Level Security — users can only access their own data.</li>
              <li>API keys and secrets are stored as environment variables, never in code.</li>
            </ul>
          </Section>

          <Section title="Your Rights">
            <p>You can:</p>
            <ul>
              <li><strong>Access your data:</strong> View all your generated content in your History page.</li>
              <li><strong>Delete your data:</strong> Delete individual generations or your entire account from Settings.</li>
              <li><strong>Export your data:</strong> Copy any generated content at any time.</li>
              <li><strong>Cancel your account:</strong> Cancel your subscription and delete your account anytime.</li>
            </ul>
          </Section>

          <Section title="Cookies">
            <p>We use essential cookies only — for authentication and keeping you logged in. No tracking cookies, no analytics cookies, no advertising cookies.</p>
          </Section>

          <Section title="Changes to This Policy">
            <p>If we make significant changes to this policy, we&apos;ll notify you by email. Minor updates will be reflected in the &ldquo;Last updated&rdquo; date above.</p>
          </Section>

          <Section title="Contact">
            <p>Questions about privacy? Email us at <strong>support@repurposely.com</strong>.</p>
          </Section>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative bg-[#111113] border border-[#1e1e24] rounded-2xl p-6 hover:border-primary/20 transition-all">
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <h2 className="text-lg font-bold text-white mb-3">{title}</h2>
      <div className="text-sm text-foreground/60 leading-relaxed space-y-2 [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:space-y-1.5 [&_strong]:text-white">
        {children}
      </div>
    </div>
  );
}
