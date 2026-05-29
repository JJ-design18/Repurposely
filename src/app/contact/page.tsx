"use client";

import { useState } from "react";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { Send, Mail, MessageCircle, Clock, Check, Zap } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Open mailto with form data
    const mailtoSubject = encodeURIComponent(`[${subject}] Contact from ${name}`);
    const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`);
    window.open(`mailto:support@repurposely.co?subject=${mailtoSubject}&body=${mailtoBody}`, "_self");
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      <div className="pt-28 pb-20 px-6 max-w-4xl mx-auto flex-1">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-6">
            <Zap className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-foreground/60 text-lg">
            Question, feature request, or just want to say hi? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Contact info cards */}
          <div className="space-y-4">
            {[
              {
                icon: Mail,
                title: "Email",
                desc: "support@repurposely.co",
              },
              {
                icon: Clock,
                title: "Response Time",
                desc: "Usually within 24 hours",
              },
              {
                icon: MessageCircle,
                title: "Quick Answers",
                desc: "Check our FAQ first",
                link: "/faq",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="relative bg-[#111113] border border-[#1e1e24] rounded-2xl p-5 hover:border-primary/40 transition-all group"
              >
                <div className="absolute top-0 left-5 right-5 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white">{item.title}</h3>
                    {item.link ? (
                      <Link href={item.link} className="text-xs text-primary hover:underline">
                        {item.desc}
                      </Link>
                    ) : (
                      <p className="text-xs text-foreground/50">{item.desc}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="md:col-span-2">
            {submitted ? (
              <div className="relative bg-[#111113] border border-primary/20 rounded-2xl p-10 text-center">
                <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Message Sent</h2>
                <p className="text-foreground/50 text-sm mb-6">
                  Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName("");
                    setEmail("");
                    setMessage("");
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="relative bg-[#111113] border border-[#1e1e24] rounded-2xl p-7">
                <div className="absolute top-0 left-7 right-7 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1.5">Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Your name"
                        className="w-full bg-[#0a0a0c] border border-[#1e1e24] rounded-xl px-4 py-3 text-sm text-white placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1.5">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="w-full bg-[#0a0a0c] border border-[#1e1e24] rounded-xl px-4 py-3 text-sm text-white placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-[#0a0a0c] border border-[#1e1e24] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    >
                      <option value="general">General Question</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing</option>
                      <option value="feature">Feature Request</option>
                      <option value="bug">Bug Report</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                      placeholder="How can we help?"
                      className="w-full bg-[#0a0a0c] border border-[#1e1e24] rounded-xl px-4 py-3 text-sm text-white placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
