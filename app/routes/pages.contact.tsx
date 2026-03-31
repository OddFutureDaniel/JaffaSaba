import { useState } from 'react';
import { StoreLayout } from '~/components/StoreLayout';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState({
    first: '',
    last: '',
    email: '',
    orderNumber: '',
    message: '',
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!values.first.trim()) newErrors.first = 'First name is required';
    if (!values.last.trim()) newErrors.last = 'Last name is required';
    if (!values.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(values.email)) newErrors.email = 'Enter a valid email';
    if (!values.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    try {
      const res = await fetch('https://formspree.io/f/xykbevkk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: values.first,
          lastName: values.last,
          email: values.email,
          orderNumber: values.orderNumber,
          message: values.message,
        }),
      });
  
      if (res.ok) {
        setErrors({});
        setSubmitted(true);
      } else {
        setErrors({ form: 'Something went wrong, please try again.' });
      }
    } catch {
      setErrors({ form: 'Something went wrong, please try again.' });
    }
  };

  const handleChange = (field: string, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (submitted) {
    return (
      <StoreLayout id="contact-page">
        <div className="contact-page">
          <p className="contact-heading">Message Sent</p>
          <p className="contact-success">Message Sent</p>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout id="contact-page">
      <div className="contact-page">
        <p className="contact-heading">Contact</p>
        <form className="contact-form" onSubmit={handleSubmit} noValidate>

          <div className="contact-row">
            <div className="contact-field">
              <label className="contact-label">First <span className="contact-required">*</span></label>
              <input
                type="text"
                placeholder=""
                className={`contact-input${errors.first ? ' contact-input--error' : ''}`}
                value={values.first}
                onChange={e => handleChange('first', e.target.value)}
              />
              {errors.first && <span className="contact-error">{errors.first}</span>}
            </div>
            <div className="contact-field">
              <label className="contact-label">Last <span className="contact-required">*</span></label>
              <input
                type="text"
                placeholder=""
                className={`contact-input${errors.last ? ' contact-input--error' : ''}`}
                value={values.last}
                onChange={e => handleChange('last', e.target.value)}
              />
              {errors.last && <span className="contact-error">{errors.last}</span>}
            </div>
          </div>

          <div className="contact-row">
            <div className="contact-field">
              <label className="contact-label">Email <span className="contact-required">*</span></label>
              <input
                type="email"
                placeholder=""
                className={`contact-input${errors.email ? ' contact-input--error' : ''}`}
                value={values.email}
                onChange={e => handleChange('email', e.target.value)}
              />
              {errors.email && <span className="contact-error">{errors.email}</span>}
            </div>
            <div className="contact-field">
              <label className="contact-label">Order number</label>
              <input
                type="text"
                placeholder=""
                className="contact-input"
                value={values.orderNumber}
                onChange={e => handleChange('orderNumber', e.target.value)}
              />
            </div>
          </div>

          <div className="contact-field">
            <label className="contact-label">Message <span className="contact-required">*</span></label>
            <textarea
              placeholder=""
              className={`contact-textarea${errors.message ? ' contact-input--error' : ''}`}
              rows={8}
              value={values.message}
              onChange={e => handleChange('message', e.target.value)}
            />
            {errors.message && <span className="contact-error">{errors.message}</span>}
          </div>

          <button type="submit" className="contact-submit">Send</button>
        </form>
      </div>
    </StoreLayout>
  );
}