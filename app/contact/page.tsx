export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold">Contact</h1>
      <form action="https://formsubmit.co/YOUR@EMAIL.com" method="POST" className="mt-6 space-y-4">
        <input type="hidden" name="_next" value="https://mindorion.vercel.app/contact?sent=1" />
        <input type="hidden" name="_captcha" value="false" />
        <input className="w-full rounded border p-3" name="name" placeholder="Name" required />
        <input className="w-full rounded border p-3" type="email" name="email" placeholder="Email" required />
        <textarea className="w-full rounded border p-3" name="message" placeholder="Message" rows={6} required />
        <button className="rounded bg-indigo-600 px-5 py-2.5 text-white" type="submit">Send</button>
      </form>
    </div>
  );
}
