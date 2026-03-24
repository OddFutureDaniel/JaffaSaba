import { StoreLayout } from '~/components/StoreLayout';

export default function Contact() {
  return (
    <StoreLayout id="contact-page" >
      <div className="contact-page">
        <p className="contact-heading">Contact</p>
        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <div className="contact-row">
            <input type="text" placeholder="first name" className="contact-input" required />
            <input type="text" placeholder="last name" className="contact-input" required />
          </div>
          <div className="contact-row">
            <input type="email" placeholder="your email" className="contact-input" required />
            <input type="text" placeholder="order number" className="contact-input" />
          </div>
          <textarea placeholder="message" className="contact-textarea" rows={8} required />
          <button type="submit" className="contact-submit">Send</button>
        </form>
      </div>
    </StoreLayout>
  );
}