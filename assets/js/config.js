/* ==========================================================================
   ROHTAK PROPERTY POINT — SITE CONFIG
   >>> THIS IS THE ONLY FILE YOU NEED TO EDIT DAY TO DAY. <<<
   ========================================================================== */

window.RPP = {

  /* ----------------------------------------------------------------------
     1. PHONE + WHATSAPP
     WhatsApp number: country code + number, digits only.
     081000 00736  ->  91 + 8100000736  ->  "918100000736"
     ---------------------------------------------------------------------- */
  whatsappNumber: '918100000736',
  whatsappText:   "Hello Rohtak Property Point — I found you on your website and I'd like to know more.",

  phoneDisplay:   '+91 81000 00736',
  phoneHref:      '+918100000736',

  /* ----------------------------------------------------------------------
     2. OFFICE — taken from the Google Business Profile
     ---------------------------------------------------------------------- */
  address: 'Shop No. 157, Market Sector 2 & 3, near Jaat Bhawan, Tilak Nagar, Sector 3, Rohtak, Haryana 124001',
  hours:   'Open every day · 8 AM – 8 PM',
  googleProfile: 'https://share.google/cFkKcSjOGlK5zalMN',
  directions:    'https://www.google.com/maps/dir/?api=1&destination=Rohtak+Property+Point,+Sector+3,+Rohtak,+Haryana+124001',

  /* ----------------------------------------------------------------------
     3. FORM DELIVERY
     Leave empty ('') and every form opens WhatsApp with the enquiry
     pre-filled — works with zero backend. Paste a Formspree / Getform /
     own-API POST URL here to receive enquiries by email instead.
     ---------------------------------------------------------------------- */
  formEndpoint: '',

  /* ----------------------------------------------------------------------
     4. LISTINGS  —  ***SAMPLE DATA: REPLACE WITH REAL INVENTORY***
     cat:    plots | floors | kothis | commercial | rent
     status: 'For Sale' | 'For Rent' | 'Sold' | 'Rented'
     img:    any image path. Real photos (jpg/webp, 4:3) look best —
             drop them in assets/img/listings/ and point at them here.
     price:  leave as 'Price on request' if you'd rather talk first.
     ---------------------------------------------------------------------- */
  listings: [
    {
      title:    'Residential Plot',
      cat:      'plots',
      status:   'For Sale',
      location: 'Sector 27, Rohtak',
      size:     '240 sq. yd',
      price:    'Price on request',
      img:      'assets/img/listings/plate-plot.svg?v=2',
      features: ['HSVP sector', 'Wide road', 'Registry ready']
    },
    {
      title:    'Independent Floor · 3 BHK',
      cat:      'floors',
      status:   'For Sale',
      location: 'Sector 3, Rohtak',
      size:     'First floor · 3 BHK',
      price:    'Price on request',
      img:      'assets/img/listings/plate-floor.svg?v=2',
      features: ['Stilt parking', 'Lift', 'Modular kitchen']
    },
    {
      title:    'Double-Storey Kothi',
      cat:      'kothis',
      status:   'For Sale',
      location: 'Sector 2, Rohtak',
      size:     '300 sq. yd · 5 BHK',
      price:    'Price on request',
      img:      'assets/img/listings/plate-kothi.svg?v=2',
      features: ['Corner', 'Lawn', 'Servant quarter']
    },
    {
      title:    'Market Shop',
      cat:      'commercial',
      status:   'For Sale',
      location: 'Market Sector 2 & 3, Rohtak',
      size:     'Ground floor · front facing',
      price:    'Price on request',
      img:      'assets/img/listings/plate-shop.svg?v=2',
      features: ['Main market', 'High footfall', 'Clear title']
    },
    {
      title:    '2 BHK Floor for Rent',
      cat:      'rent',
      status:   'For Rent',
      location: 'Tilak Nagar, Rohtak',
      size:     'Second floor · semi-furnished',
      price:    'Rent on request',
      img:      'assets/img/listings/plate-rent.svg?v=2',
      features: ['Family preferred', 'Parking', 'Near market']
    },
    {
      title:    'SCO / Showroom',
      cat:      'commercial',
      status:   'For Sale',
      location: 'Sector 1, Rohtak',
      size:     'Ground + 2 floors',
      price:    'Price on request',
      img:      'assets/img/listings/plate-sco.svg?v=2',
      features: ['Road facing', 'Glass frontage', 'Ideal for showroom']
    }
  ]
};

/* --------------------------------------------------------------------------
   Helper: build a wa.me deep link.
   -------------------------------------------------------------------------- */
window.RPP.waLink = function (text) {
  var n = (window.RPP.whatsappNumber || '').replace(/\D/g, '');
  var t = encodeURIComponent(text || window.RPP.whatsappText);
  return 'https://wa.me/' + n + '?text=' + t;
};
