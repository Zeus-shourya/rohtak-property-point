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
     2. OFFICE + SOCIAL
     ---------------------------------------------------------------------- */
  address: 'Shop No. 157, Market Sector 2, near Jaat Bhawan, Tilak Nagar, Rohtak, Haryana 124001',
  hours:   'Open every day · 8 AM – 8 PM',
  googleProfile: 'https://share.google/cFkKcSjOGlK5zalMN',
  instagram:     'https://www.instagram.com/rohtakpropertypoint/',
  directions:    'https://www.google.com/maps/dir/?api=1&destination=Rohtak+Property+Point,+Rohtak,+Haryana+124001',

  /* ----------------------------------------------------------------------
     3. FORM DELIVERY
     Leave empty ('') and every form opens WhatsApp with the enquiry
     pre-filled — works with zero backend. Paste a Formspree / Getform /
     own-API POST URL here to receive enquiries by email instead.
     ---------------------------------------------------------------------- */
  formEndpoint: '',

  /* ----------------------------------------------------------------------
     4. LISTINGS — the property posters from the Instagram account
     (@rohtakpropertypoint), newest first. Details were read off each poster.

     To add a property:
       1. save the poster (square, ~1080px, .webp or .jpg) in assets/img/posters/
       2. copy one block below, change the fields, and put it at the top

     cat:      'plots' | 'houses'  (a filter button appears for every category used;
               'floors' | 'commercial' | 'rent' also work)
     status:   'For Sale' | 'For Rent' | 'Sold' | 'Rented'
     price:    shown on the card; the poster's "Demand" figure
     features: short chips shown in the detail pop-up
     ig:       the post's code from instagram.com/p/<code>/ — adds a
               "View original post" link (optional)
     fit:      'contain' for posters that are not square, so nothing is cropped
     ---------------------------------------------------------------------- */
  listings: [
    {
      title:    '2.5-Storey House',
      cat:      'houses',
      status:   'For Sale',
      location: 'Sector 35, Rohtak',
      size:     '200 yd (8 Marla) · East facing',
      price:    '₹2.80 Cr',
      img:      'assets/img/posters/house-sector-35-200yd.webp',
      fit:      'contain',
      ig:       'DedlVrszZjh',
      features: ['Newly constructed', 'Block B', '3 BHK on every floor', 'Near park', 'Road 12 m', 'Near all amenities']
    },
    {
      title:    'Single-Storey House',
      cat:      'houses',
      status:   'For Sale',
      location: 'Sector 1, Rohtak',
      size:     '250 yd (10 Marla) · North facing',
      price:    '₹3.35 Cr',
      img:      'assets/img/posters/house-sector-1-250yd.webp',
      ig:       'DedlRFOzFpP',
      features: ['Green belt facing', 'On the 30 m Sector 1–2 dividing road', 'Near all amenities']
    },
    {
      title:    'Park-Facing Plot',
      cat:      'plots',
      status:   'For Sale',
      location: 'Marwa Society, Rohtak',
      size:     '160 yd (6 Marla)',
      price:    '₹60,000 / yard',
      img:      'assets/img/posters/plot-marwa-society-160yd.webp',
      ig:       'DedlPLVTMt8',
      features: ['Park facing', 'Registry case', 'Road 10 m', 'Negotiable']
    },
    {
      title:    'North-Facing Plot',
      cat:      'plots',
      status:   'For Sale',
      location: 'Sector 25, Rohtak',
      size:     '113 yd (4 Marla) · North facing',
      price:    '₹1 lakh / yard',
      img:      'assets/img/posters/plot-sector-25-113yd.webp',
      ig:       'DedlMDMzeIv',
      features: ['Near park', 'Near all amenities']
    },
    {
      title:    'East-Facing Plot',
      cat:      'plots',
      status:   'For Sale',
      location: 'Sector 2, Rohtak',
      size:     '60 yd · East facing',
      price:    '₹57 lakh',
      img:      'assets/img/posters/plot-sector-2-60yd.webp',
      ig:       'DedlG2dTeEm',
      features: ['Near park', 'Near all amenities']
    },
    {
      title:    'West & Market-Facing Plot',
      cat:      'plots',
      status:   'For Sale',
      location: 'Sector 35, Rohtak',
      size:     '200 yd (8 Marla) · West & market facing',
      price:    '₹1 lakh / yard',
      img:      'assets/img/posters/plot-sector-35-200yd.webp',
      ig:       'Dedk8juTTvn',
      features: ['Block B', 'Road 12 m', 'Near all amenities', 'Negotiable']
    },
    {
      title:    'Corner Plot, Park-Facing',
      cat:      'plots',
      status:   'For Sale',
      location: 'Sector 4 Extension, Rohtak',
      size:     '263 yd (10 Marla) · West & park facing',
      price:    '₹3.10 Cr',
      img:      'assets/img/posters/plot-sector-4-ext-263yd.webp',
      ig:       'Dedk6jWTIM4',
      features: ['Corner plot', 'Park facing', 'Near all amenities']
    },
    {
      title:    'New Double-Storey House',
      cat:      'houses',
      status:   'For Sale',
      location: 'Sector 2, Rohtak',
      size:     '100 yd · East facing',
      price:    '₹1.50 Cr',
      img:      'assets/img/posters/house-sector-2-100yd.webp',
      ig:       'Dedk4Z_zxx3',
      features: ['Newly constructed', 'Road 10 m', 'School, hospital & market nearby', 'Wide roads', 'Security']
    },
    {
      title:    'West-Facing Corner Plot',
      cat:      'plots',
      status:   'For Sale',
      location: 'Sector 1, Rohtak',
      size:     '251 yd (10 Marla) · West facing',
      price:    '₹3.20 Cr',
      img:      'assets/img/posters/plot-sector-1-251yd.webp',
      ig:       'Dedk05ZzXKq',
      features: ['Corner plot', 'Road 12 m', 'Near park', 'Near all amenities', 'Negotiable']
    },
    {
      title:    'Plot Opposite HUDA Office',
      cat:      'plots',
      status:   'For Sale',
      location: 'Sector 2, Rohtak',
      size:     '251 yd (10 Marla)',
      price:    '₹2.75 Cr',
      img:      'assets/img/posters/plot-sector-2-huda-251yd.webp',
      ig:       'DedkzA9zFk7',
      features: ['Opposite HUDA office', 'Road 10 m', 'Near sector-joining road', 'Near park', 'Negotiable']
    },
    {
      title:    'Double-Storey House',
      cat:      'houses',
      status:   'For Sale',
      location: 'Sector 2, Rohtak',
      size:     '251 yd (10 Marla) · West facing',
      price:    '₹3.32 Cr',
      img:      'assets/img/posters/house-sector-2-251yd.webp',
      ig:       'DedkwnSz5Dx',
      features: ['Prime location', 'Road 10 m', 'Near park', 'Near all amenities', 'Negotiable']
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
