/* ==========================================================================
   ROHTAK PROPERTY POINT - FALLBACK SETTINGS
   The website's real settings and all properties are edited in the CMS
   (data/site.json and content/listings/*.json - see README.md and admin.html).
   The values below are only the safety net used if data/site.json cannot be
   loaded, so keep them in step with it after a big change.
   ========================================================================== */

window.RPP = {
  whatsappNumber: '918100000736',          /* 91 + 8100000736 */
  whatsappText:   "Hello Rohtak Property Point — I found you on your website and I'd like to know more.",

  phoneDisplay:   '+91 81000 00736',
  phoneHref:      '+918100000736',

  address: 'Shop No. 157, Market Sector 2, near Jaat Bhawan, Tilak Nagar, Rohtak, Haryana 124001',
  hours:   'Open every day · 8 AM – 8 PM',
  googleProfile: 'https://share.google/cFkKcSjOGlK5zalMN',
  instagram:     'https://www.instagram.com/rohtakpropertypoint/',
  facebook:      'https://www.facebook.com/rohtak.propertypoint/',
  directions:    'https://www.google.com/maps/dir/?api=1&destination=Rohtak+Property+Point,+Rohtak,+Haryana+124001',

  /* Leave empty and every form opens WhatsApp with the enquiry pre-filled -
     works with zero backend. Paste a Formspree / Getform / own-API POST URL
     here to receive enquiries by email instead. */
  formEndpoint: ''
};

/* Helper: build a wa.me deep link. */
window.RPP.waLink = function (text) {
  var n = (window.RPP.whatsappNumber || '').replace(/\D/g, '');
  var t = encodeURIComponent(text || window.RPP.whatsappText);
  return 'https://wa.me/' + n + '?text=' + t;
};
