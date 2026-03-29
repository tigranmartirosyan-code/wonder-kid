/**
 * Professional Landing Page Editor
 * Full drag-and-drop, live iframe preview, system + custom sections
 */
(function () {
  'use strict';

  const API = '/landing-sections';

  // ── Section type metadata ──────────────────────────────────────────
  const SECTION_TYPES = {
    hero:        { icon: 'fa-image',              color: 'yellow',  label: 'Hero',        bg: '#1e3a5f', text: '#ffffff' },
    about:       { icon: 'fa-info-circle',         color: 'blue',    label: 'About',       bg: '#f8fafc', text: '#1f2937' },
    features:    { icon: 'fa-list-ul',             color: 'green',   label: 'Features',    bg: '#f0fdf4', text: '#1f2937' },
    stats:       { icon: 'fa-chart-bar',           color: 'purple',  label: 'Stats',       bg: '#faf5ff', text: '#1f2937' },
    cta:         { icon: 'fa-bullhorn',            color: 'red',     label: 'CTA',         bg: '#2563eb', text: '#ffffff' },
    testimonial: { icon: 'fa-quote-left',          color: 'pink',    label: 'Testimonial', bg: '#fdf4ff', text: '#1f2937' },
    custom:      { icon: 'fa-code',               color: 'gray',    label: 'Custom',      bg: '#ffffff', text: '#1f2937' },
  };

  const TYPE_COLORS = {
    yellow: { badge: 'bg-yellow-100 text-yellow-700 border border-yellow-200', dot: 'bg-yellow-400' },
    blue:   { badge: 'bg-blue-100 text-blue-700 border border-blue-200',       dot: 'bg-blue-400' },
    green:  { badge: 'bg-green-100 text-green-700 border border-green-200',    dot: 'bg-green-400' },
    purple: { badge: 'bg-purple-100 text-purple-700 border border-purple-200', dot: 'bg-purple-400' },
    red:    { badge: 'bg-red-100 text-red-700 border border-red-200',          dot: 'bg-red-400' },
    pink:   { badge: 'bg-pink-100 text-pink-700 border border-pink-200',       dot: 'bg-pink-400' },
    gray:   { badge: 'bg-gray-100 text-gray-600 border border-gray-200',       dot: 'bg-gray-400' },
  };

  // ── Field config per type ──────────────────────────────────────────
  const FIELD_CONFIG = {
    hero:        { subtitle: 'Subtitle',    body: 'Description',           image: 'Background Image URL',  button: true },
    about:       { subtitle: 'Subtitle',    body: 'Body Text',             image: 'Image URL',             button: true },
    features:    { subtitle: 'Subtitle',    body: 'Features (HTML or text)', image: false,                button: false },
    stats:       { subtitle: false,         body: 'Stats Content',          image: false,                  button: false },
    cta:         { subtitle: 'Supporting Text', body: false,               image: false,                  button: true  },
    testimonial: { subtitle: 'Author Role', body: 'Quote Text',            image: 'Avatar Image URL',     button: false },
    custom:      { subtitle: false,         body: 'HTML Content',          image: false,                   button: false },
  };

  // ── Built-in (system) sections on the page ─────────────────────────
  // builtinKey: links to landing_sections DB record; defaultType: used when creating a new override
  const SYSTEM_SECTIONS = [
    { name: 'Navigation Header',   icon: 'fa-bars',               color: 'gray',   anchorId: 'sec-header',       desc: 'Fixed top navigation with logo and menu links',            builtinKey: 'header',        defaultType: 'custom' },
    { name: 'Hero Banner',         icon: 'fa-image',              color: 'yellow', anchorId: 'sec-hero',         desc: 'Main hero section with headline and image gallery',        builtinKey: 'hero',      defaultType: 'hero'  },
    { name: 'Limitless Learning',  icon: 'fa-infinity',           color: 'blue',   anchorId: 'sec-limitless',    desc: 'Highlight section for limitless learning benefits',         builtinKey: 'limitless', defaultType: 'about' },
    { name: 'Statistics Bar',      icon: 'fa-chart-bar',          color: 'purple', anchorId: 'sec-status',       desc: 'Achievement statistics and key numbers',                   builtinKey: 'status',    defaultType: 'stats' },
    { name: 'Transform Education', icon: 'fa-graduation-cap',     color: 'green',  anchorId: 'sec-about',        desc: 'Together we can transform education section',              builtinKey: 'about',     defaultType: 'about' },
    { name: 'LEGO WeDo 2.0',       icon: 'fa-info-circle',        color: 'blue',   anchorId: 'sec-about1',       desc: 'Secondary about section with additional info',             builtinKey: 'about1',    defaultType: 'about', iconImg: '/images/Mask%20group%20(1).png' },
    { name: 'LEGO WeDo',           icon: 'fa-cubes',              color: 'red',    anchorId: 'sec-legowedo',     desc: 'LEGO WeDo education product showcase',                     builtinKey: 'legowedo',  defaultType: 'about' },
    { name: 'Statistics Bar 2',    icon: 'fa-chart-bar',          color: 'purple', anchorId: 'sec-status2',      desc: 'Second statistics highlight row',                          builtinKey: 'status2',   defaultType: 'stats' },
    { name: 'Product Images',      icon: 'fa-images',             color: 'gray',   anchorId: 'sec-productimg',   desc: 'Product showcase image gallery',                           builtinKey: 'productimg',    defaultType: 'about' },
    { name: 'Courses',             icon: 'fa-book',               color: 'green',  anchorId: 'sec-courses',      desc: 'Course catalog — managed from Courses section',            builtinKey: 'courses',       defaultType: 'cta'   },
    { name: 'Enrollment Form',     icon: 'fa-file-alt',           color: 'blue',   anchorId: 'sec-enrollment',   desc: 'Student enrollment / candidate application form',          builtinKey: 'enrollment',    defaultType: 'cta'   },
    { name: 'About Section 3',     icon: 'fa-info-circle',        color: 'blue',   anchorId: 'sec-about3',       desc: 'Third about section with additional content',              builtinKey: 'about3',    defaultType: 'about' },
    { name: 'Our Coaches',         icon: 'fa-user-tie',           color: 'gray',   anchorId: 'sec-coach',        desc: 'Featured coach profile cards',                            builtinKey: 'coach',         defaultType: 'about' },
    { name: 'Loved by Parents',    icon: 'fa-heart',              color: 'red',    anchorId: 'sec-legoeducation',desc: 'Testimonials from parents',                               builtinKey: 'legoeducation', defaultType: 'about' },
    { name: 'Partners',            icon: 'fa-handshake',          color: 'purple', anchorId: 'sec-partners',     desc: 'Partner organisation logos and cards',                    builtinKey: 'partners',      defaultType: 'about' },
    { name: 'Contact Us',          icon: 'fa-envelope',           color: 'green',  anchorId: 'sec-contact',      desc: 'Contact form with radio options (Client / Partner)',       builtinKey: 'contact',   defaultType: 'cta'   },
    { name: 'Projects',            icon: 'fa-project-diagram',    color: 'blue',   anchorId: 'sec-projects',     desc: 'Blue project showcase cards',                             builtinKey: 'projects',      defaultType: 'about' },
    { name: 'About Trainers',      icon: 'fa-chalkboard-teacher', color: 'yellow', anchorId: 'sec-trainers',     desc: 'Trainer profiles — managed from Trainers section',        builtinKey: 'trainers',      defaultType: 'about' },
    { name: 'Yellow Banner',       icon: 'fa-bullhorn',           color: 'yellow', anchorId: 'sec-yellowboard',  desc: 'Yellow call-out banner section',                          builtinKey: 'yellowboard',   defaultType: 'cta'   },
    { name: 'LEGO Background',     icon: 'fa-image',              color: 'red',    anchorId: 'sec-legobg',       desc: 'LEGO background image decorative section',                builtinKey: 'legobg',        defaultType: 'hero'  },
    { name: 'Blog Background',     icon: 'fa-image',              color: 'gray',   anchorId: 'sec-blogbg',       desc: 'Blog section background image',                          builtinKey: 'blogbg',        defaultType: 'hero'  },
    { name: 'Blog Posts',          icon: 'fa-blog',               color: 'blue',   anchorId: 'sec-blogs',        desc: 'Blog post grid — managed from Blogs section',            builtinKey: 'blogs',         defaultType: 'about' },
    { name: 'Footer',              icon: 'fa-window-maximize',    color: 'gray',   anchorId: 'sec-footer',       desc: 'Page footer with links, social media and contact info',   builtinKey: 'footer',        defaultType: 'custom' },
  ];

  let sections = [];
  let dragSrcId = null;
  let pendingBuiltinKey = null;

  // ── DOM refs ───────────────────────────────────────────────────────
  const list         = document.getElementById('landing-sections-list');
  const loadingEl    = document.getElementById('landing-sections-loading');
  const emptyEl      = document.getElementById('landing-sections-empty');
  const countEl      = document.getElementById('ls-section-count');
  const customCountEl= document.getElementById('ls-custom-count');
  const systemList   = document.getElementById('system-sections-list');

  const modal        = document.getElementById('landing-section-modal');
  const modalTitle   = document.getElementById('ls-modal-title');
  const modalSub     = document.getElementById('ls-modal-subtitle');
  const modalIcon    = document.getElementById('ls-modal-type-icon');
  const form         = document.getElementById('landing-section-form');
  const idInput      = document.getElementById('ls-section-id');
  const submitLabel  = document.getElementById('ls-submit-label');
  const typeSelect   = document.getElementById('ls-section-type');
  const imageUrlInput= document.getElementById('ls-imageUrl');
  const isVisCheck   = document.getElementById('ls-isVisible');
  const visLabel     = document.getElementById('ls-visible-label');
  const bgColorInput = document.getElementById('ls-backgroundColor');
  const txColorInput = document.getElementById('ls-textColor');
  const bgHexInput   = document.getElementById('ls-bg-hex');
  const txHexInput   = document.getElementById('ls-text-hex');
  const colorPreview = document.getElementById('ls-color-preview');
  const colorPrevTitle= document.getElementById('ls-color-preview-title');
  const colorPrevSub = document.getElementById('ls-color-preview-sub');
  const dropZone     = document.getElementById('ls-drop-zone');
  const fileInput    = document.getElementById('ls-image-file');
  const uploadProgress= document.getElementById('ls-upload-progress');
  const dropPlaceholder= document.getElementById('ls-drop-placeholder');
  const builtinBadge = document.getElementById('ls-builtin-badge');

  const iframe       = document.getElementById('ls-preview-iframe');
  const previewWrap  = document.getElementById('ls-preview-wrapper');
  const refreshBtn   = document.getElementById('ls-refresh-btn');

  // ── Properties Drawer refs ─────────────────────────────────────────
  const drawer       = document.getElementById('ls-props-drawer');
  const drawerIcon   = document.getElementById('ls-drawer-icon');
  const drawerTitle  = document.getElementById('ls-drawer-title');
  const drawerSub    = document.getElementById('ls-drawer-sub');
  const drawerIdIn   = document.getElementById('ls-drawer-id');
  const drawerAnchor = document.getElementById('ls-drawer-anchor');
  const drawerBuiltin= document.getElementById('ls-drawer-builtin');
  const liveBadge    = document.getElementById('ls-live-badge');

  // Drawer fields
  const dType      = document.getElementById('ls-drawer-type');
  const dTitle     = document.getElementById('ls-drawer-title-field');
  const dSubtitle  = document.getElementById('ls-drawer-subtitle');
  const dBody      = document.getElementById('ls-drawer-body');

  // Translation field refs
  const dTrRuTitle    = document.getElementById('ls-tr-ru-title');
  const dTrRuSubtitle = document.getElementById('ls-tr-ru-subtitle');
  const dTrRuBody     = document.getElementById('ls-tr-ru-body');
  const dTrHyTitle    = document.getElementById('ls-tr-hy-title');
  const dTrHySubtitle = document.getElementById('ls-tr-hy-subtitle');
  const dTrHyBody     = document.getElementById('ls-tr-hy-body');
  const dBgColor   = document.getElementById('ls-drawer-bgcolor');
  const dTxColor   = document.getElementById('ls-drawer-txcolor');
  const dBgHex     = document.getElementById('ls-drawer-bg-hex');
  const dTxHex     = document.getElementById('ls-drawer-tx-hex');
  const dBtnText   = document.getElementById('ls-drawer-btntext');
  const dBtnLink   = document.getElementById('ls-drawer-btnlink');
  const dImageUrl  = document.getElementById('ls-drawer-imageurl');
  const dVisible   = document.getElementById('ls-drawer-visible');
  const dVisLabel  = document.getElementById('ls-drawer-vis-label');
  const dOrder     = document.getElementById('ls-drawer-order');
  const dColorPrev = document.getElementById('ls-drawer-color-preview');
  const dPrevTitle = document.getElementById('ls-drawer-prev-title');
  const dPrevSub   = document.getElementById('ls-drawer-prev-sub');
  const dPrevBtn   = document.getElementById('ls-drawer-prev-btn');
  const dDropzone  = document.getElementById('ls-drawer-dropzone');
  const dFileInput = document.getElementById('ls-drawer-file');
  const dImgWrap   = document.getElementById('ls-drawer-img-preview-wrap');
  const dImgPreview= document.getElementById('ls-drawer-img-preview');
  const dImgPlaceholder = document.getElementById('ls-drawer-img-placeholder');
  const dUploadProgress = document.getElementById('ls-drawer-upload-progress');
  const dImg1Remove = document.getElementById('ls-drawer-img1-remove');

  const dDropzone2  = document.getElementById('ls-drawer-dropzone2');
  const dFileInput2 = document.getElementById('ls-drawer-file2');
  const dImgWrap2   = document.getElementById('ls-drawer-img2-preview-wrap');
  const dImgPreview2= document.getElementById('ls-drawer-img2-preview');
  const dImgPlaceholder2 = document.getElementById('ls-drawer-img2-placeholder');
  const dUploadProgress2 = document.getElementById('ls-drawer-upload-progress2');
  const dImageUrl2  = document.getElementById('ls-drawer-imageurl2');
  const dImg2Remove = document.getElementById('ls-drawer-img2-remove');

  const dDropzone3  = document.getElementById('ls-drawer-dropzone3');
  const dFileInput3 = document.getElementById('ls-drawer-file3');
  const dImgWrap3   = document.getElementById('ls-drawer-img3-preview-wrap');
  const dImgPreview3= document.getElementById('ls-drawer-img3-preview');
  const dImgPlaceholder3 = document.getElementById('ls-drawer-img3-placeholder');
  const dUploadProgress3 = document.getElementById('ls-drawer-upload-progress3');
  const dImageUrl3  = document.getElementById('ls-drawer-imageurl3');
  const dImg3Remove = document.getElementById('ls-drawer-img3-remove');

  const dBuiltinInfo= document.getElementById('ls-drawer-builtin-info');
  const dBuiltinKeyLabel = document.getElementById('ls-drawer-builtin-key-label');

  // Rich text (Quill) editor
  const dBodyQuillWrap = document.getElementById('ls-drawer-body-quill');
  let quillInstance = null;

  function getOrInitQuill() {
    if (!quillInstance && window.Quill) {
      quillInstance = new Quill('#ls-quill-editor', {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean'],
          ],
        },
      });
    }
    return quillInstance;
  }

  // Card editor containers (content rendered dynamically by JS)
  const dCardsEditor      = document.getElementById('ls-cards-editor');
  const dCoachCardsEditor = document.getElementById('ls-coach-cards-editor');
  const dTestCardsEditor  = document.getElementById('ls-testimonial-cards-editor');

  // Grid section editor (about / Transform Education section)
  const dGridSectionEditor = document.getElementById('ls-grid-section-editor');
  const dGridDesc = document.getElementById('ls-grid-desc');
  const dGridImgSlots = [1,2,3,4,5,6].map(i => ({
    url:         document.getElementById(`ls-gimg${i}-url`),
    file:        document.getElementById(`ls-gimg${i}-file`),
    preview:     document.getElementById(`ls-gimg${i}-preview`),
    placeholder: document.getElementById(`ls-gimg${i}-placeholder`),
    progress:    document.getElementById(`ls-gimg${i}-progress`),
  }));

  const dStatCardsEditor    = document.getElementById('ls-stat-cards-editor');
  const dSchedCardsEditor   = document.getElementById('ls-schedule-cards-editor');
  const dTrainerCardsEditor = document.getElementById('ls-trainer-cards-editor');
  const dPartnerCardsEditor = document.getElementById('ls-partner-cards-editor');
  const dProjectCardsEditor = document.getElementById('ls-project-cards-editor');

  let drawerDebounceTimer = null;

  // ── Per-builtin form configuration ────────────────────────────────
  // tabs: which tabs to show  |  fields: which content/style fields to show
  // 'cards': show 4-card editor instead of body
  const BUILTIN_FORM = {
    header: {
      tabs: ['content','settings'], title: false, subtitle: false, body: 'HTML Content', cards: false, button: false, type: false,
      defaults: { body: '<!-- Edit navigation HTML here -->' },
    },
    hero: {
      tabs: ['content','media','settings','translations'], title: 'Headline', subtitle: false, body: 'Description', cards: false, button: false, type: false,
      defaults: {
        title: 'LEGO® EDUCATION INSPIRES LEARNING YOU CAN BUILD ON',
        body: 'Learning solutions designed to empower students and teachers, build deeper understanding and engagement, and ignite a life-long love of learning.',
        imageUrl: '/images/Group%2035.png', imageUrl2: '/images/Group%2034.png', imageUrl3: '/images/Mask group (3).png',
      },
    },
    limitless: {
      tabs: ['content','settings','translations'], title: 'Section Title', subtitle: 'Subtitle', body: false, cards: true, button: false, type: false,
      defaults: {
        title: 'UNLOCK LIMITLESS POTENTIAL',
        subtitle: 'Meaningful learning, extraordinary engagement, and the resources and support to ensure success.',
      },
    },
    status: {
      tabs: ['content','settings'], title: false, subtitle: false, body: false, cards: false, statCards: true, button: false, type: false,
      defaults: {},
    },
    about2: {
      tabs: ['content','media','settings','translations'], title: 'Title', subtitle: false, body: 'Body Text', cards: false, button: true, type: false,
      defaults: {
        title: 'OUR SHORT STORY',
        body: 'By inviting joy and curiosity into the classroom, we can enable all students and educators to thrive, developing the skills needed to build a better world for themselves and for others.',
        imageUrl: '/images/pexels-a-darmel-7750719.png',
        buttonText: 'READ MORE', buttonLink: '#',
      },
    },
    about: {
      tabs: ['content','settings','translations'], title: 'Title', subtitle: false, body: false, cards: false, gridImages: true, button: true, type: false,
      defaults: {
        title: 'Together, We Can Transform Education',
        buttonText: 'READ MORE', buttonLink: '#',
      },
    },
    about1: {
      tabs: ['content','media','settings','translations'], title: 'Title', subtitle: 'Price', body: 'Body Text', cards: false, button: true, type: false,
      defaults: {
        title: 'LEGO WEDO 2.0',
        subtitle: '15.000 AMD',
        body: 'Adobe Illustrator · Adobe Photoshop · Logo and brand identity creation',
        imageUrl: '/svg/Mask%20group%20(1).svg',
        buttonText: 'APPLY NOW', buttonLink: '#',
      },
    },
    legowedo: {
      tabs: ['content','media','settings','translations'], title: 'Title', subtitle: false, body: 'Description', richText: true, cards: false, button: false, type: false,
      defaults: {
        title: 'WHY PARTICIPATE IN THE LEGO WEDO 2.0 COURSE?',
        body: '<p>If you have a passion for drawing and sketching, or are intrigued by the world of design, you can begin your journey of acquiring exciting expertise through this course.</p>',
      },
    },
    status2: {
      tabs: ['content','settings'], title: false, subtitle: false, body: false, cards: false, scheduleCards: true, button: false, type: false,
      defaults: {},
    },
    productimg: {
      tabs: ['media','settings'], title: false, subtitle: false, body: false, cards: false, button: false, type: false, singleImage: true,
      defaults: { imageUrl: '/images/Group%20383.png' },
    },
    about3: {
      tabs: ['content','media','settings','translations'], title: 'Title', subtitle: false, body: 'Body Text', cards: false, button: true, type: false, singleImage: true,
      defaults: {
        title: 'OUR SHORT STORY',
        body: 'By inviting joy and curiosity into the classroom, we can enable all students and educators to thrive, developing the skills needed to build a better world for themselves and for others.',
        imageUrl: '/images/Group%2042.png',
        buttonText: 'READ MORE', buttonLink: '#',
      },
    },
    coach: {
      tabs: ['content','settings','translations'], title: 'Section Title', subtitle: false, body: false, cards: false, coachCards: true, button: false, type: false,
      defaults: { title: 'OUR COACHES' },
    },
    legoeducation: {
      tabs: ['content','settings','translations'], title: 'Section Title', subtitle: false, body: false, cards: false, testimonialCards: true, button: false, type: false,
      defaults: { title: 'LOVED BY PARENTS' },
    },
    partners: {
      tabs: ['content','settings','translations'], title: 'Section Title', subtitle: false, body: false, partnerCards: true, button: false, type: false,
      defaults: { title: 'PARTNERS' },
    },
    contact: {
      tabs: ['content','settings','translations'], title: 'Heading', subtitle: 'Subheading', body: false, cards: false, button: false, type: false,
      defaults: {
        title: 'HELLO',
        subtitle: 'Our team of experts is here to help find the solution that fits your students\' needs.',
      },
    },
    projects: {
      tabs: ['content','settings','translations'], title: 'Title', subtitle: 'Subtitle', body: false, projectCards: true, button: false, type: false,
      defaults: { title: 'OUR PROJECTS', subtitle: 'EXPERIENCE THE FUN' },
    },
    trainers: {
      tabs: ['content','settings'], title: 'Title', subtitle: 'Subtitle', body: false, cards: false, trainerCards: true, button: false, type: false,
      defaults: { title: 'OUR TRAINERS', subtitle: 'Meet our certified LEGO Education trainers' },
    },
    yellowboard: {
      tabs: ['content','settings','translations'], title: 'Headline', subtitle: false, body: false, cards: false, button: true, type: false,
      defaults: {
        title: 'BRING LEGO® EDUCATION TO YOUR SCHOOL OR DISTRICT',
        buttonText: 'CONTACT US', buttonLink: '#contact-form',
      },
    },
    legobg: {
      tabs: ['media','settings'], title: false, subtitle: false, body: false, cards: false, button: false, type: false,
      defaults: { imageUrl: '/svg/45401_alt1%201.svg' },
    },
    blogbg: {
      tabs: ['content','media','settings','translations'], title: 'Title', subtitle: 'Subtitle', body: false, cards: false, button: false, type: false, singleImage: true,
      defaults: { title: 'BLOG', subtitle: 'Latest news and articles', imageUrl: 'https://cdn.britannica.com/48/182648-050-6C20C6AB/LEGO-bricks.jpg' },
    },
    blogs: {
      tabs: ['content','settings'], title: 'Title', subtitle: 'Subtitle', body: false, cards: false, button: false, type: false,
      defaults: { title: 'BLOG', subtitle: 'Latest news and articles' },
    },
    courses: {
      tabs: ['content','settings','translations'], title: 'Title', subtitle: 'Subtitle', body: false, cards: false, button: false, type: false,
      defaults: { title: 'OUR PRODUCTS INCLUDE', subtitle: 'STANDARDS-ALIGNED LESSONS' },
    },
    enrollment: {
      tabs: ['content','settings','translations'], title: 'Heading', subtitle: 'Subheading', body: false, cards: false, button: false, type: false,
      defaults: { title: 'ENROLLMENT FORM', subtitle: 'Join our LEGO Education program' },
    },
    footer: {
      tabs: ['content','settings'], title: false, subtitle: false, body: 'HTML Content', cards: false, button: false, type: false,
      defaults: { body: '<!-- Edit footer HTML here -->' },
    },
  };

  // ── Locale key mapping: builtinKey → { section, fields: {drawerField: localeKey} } ──
  const LOCALE_MAP = {
    hero:          { section: 'hero',         fields: { title: 'title', body: 'body' } },
    limitless:     { section: 'limitless',    fields: { title: 'title', subtitle: 'subtitle' } },
    about:         { section: 'about',        fields: { title: 'title', body: 'body' } },
    about1:        { section: 'about1',       fields: { title: 'title', body: 'body' } },
    about2:        { section: 'about2',       fields: { title: 'title', body: 'body' } },
    about3:        { section: 'about2',       fields: { title: 'title', body: 'body' } },
    legowedo:      { section: 'legoWedo',     fields: { title: 'title', subtitle: 'subtitle', body: 'body' } },
    coach:         { section: 'coaches',      fields: { title: 'title' } },
    legoeducation: { section: 'testimonials', fields: { title: 'title' } },
    partners:      { section: 'partners',     fields: { title: 'title' } },
    contact:       { section: 'contact',      fields: { title: 'title', subtitle: 'subtitle' } },
    projects:      { section: 'projects',     fields: { title: 'title', subtitle: 'subtitle' } },
    yellowboard:   { section: 'yellowBoard',  fields: { title: 'title' } },
    blogbg:        { section: 'blogBg',       fields: { title: 'title' } },
    courses:       { section: 'product',      fields: { title: 'heading1', subtitle: 'heading2' } },
    enrollment:    { section: 'form',         fields: { title: 'title', subtitle: 'subtitle' } },
  };

  // ── Dynamic Card Editor Configs ────────────────────────────────────
  const CARD_PALETTE = {
    blue:   { border:'border-blue-100',   bg:'bg-blue-50',   text:'text-blue-500',   inp:'border-blue-200',   ring:'focus:ring-blue-400',   imgBorder:'border-blue-300'   },
    yellow: { border:'border-yellow-100', bg:'bg-yellow-50', text:'text-yellow-600', inp:'border-yellow-200', ring:'focus:ring-yellow-400', imgBorder:'border-yellow-300' },
    green:  { border:'border-green-100',  bg:'bg-green-50',  text:'text-green-600',  inp:'border-green-200',  ring:'focus:ring-green-400',  imgBorder:'border-green-300'  },
    red:    { border:'border-red-100',    bg:'bg-red-50',    text:'text-red-500',    inp:'border-red-200',    ring:'focus:ring-red-400',    imgBorder:'border-red-300'    },
    purple: { border:'border-purple-100', bg:'bg-purple-50', text:'text-purple-600', inp:'border-purple-200', ring:'focus:ring-purple-400', imgBorder:'border-purple-300' },
  };

  const CARD_CONFIGS = {
    limitless: {
      editorId: 'ls-cards-editor',      listId: 'ls-cards-list',      addBtnId: 'ls-cards-add-btn',
      builtinFlag: 'cards', icon: 'fa-layer-group', label: 'Card',
      colors: ['blue','yellow','green','purple'],
      fields: [
        { key:'title', type:'input',    placeholder:'Card title e.g. LEARN THROUGH PLAY', bold:true },
        { key:'desc',  type:'textarea', placeholder:'Card description…', rows:2 },
      ],
      hasImage: false,
      defaults: [
        { title:'LEARN THROUGH PLAY',    desc:'LEGO-based activities that make complex STEAM concepts accessible and fun for children of all ages.' },
        { title:'BUILD & PROGRAM ROBOTS',desc:'Kids design, build, and code robots using LEGO WeDo 2.0, developing engineering and programming skills hands-on.' },
        { title:'COLLABORATIVE PROJECTS',desc:'Team-based challenges that develop communication, problem-solving, and critical thinking skills through building together.' },
        { title:'CERTIFIED CURRICULUM',  desc:'Standards-aligned lesson plans designed by LEGO Education experts, ensuring quality learning outcomes for every student.' },
      ],
      addLabel:'Add Card',
      iframeSelector:'.grid > div.flex',
      patchCard:(el,d)=>{ const h=el.querySelector('h3'); if(h) h.textContent=d.title||''; const p=el.querySelector('p'); if(p) p.textContent=d.desc||''; },
    },
    status: {
      editorId: 'ls-stat-cards-editor', listId: 'ls-stat-cards-list', addBtnId: 'ls-stat-cards-add-btn',
      builtinFlag: 'statCards', icon: 'fa-chart-bar', label: 'Stat',
      colors: ['red','red','red'],
      fields: [
        { key:'value', type:'input', placeholder:'Value e.g. 2+',                bold:true },
        { key:'label', type:'input', placeholder:'Label e.g. Year Experience' },
      ],
      hasImage: false,
      defaults: [
        { value:'2+',   label:'Year Experience' },
        { value:'300+', label:'Members in Our Community' },
        { value:'400+', label:'Standards-Aligned Lessons' },
      ],
      addLabel:'Add Stat',
      iframeSelector:'.stat-card',
      patchCard:(el,d)=>{ const h=el.querySelector('h3'); if(h) h.textContent=d.value||''; const p=el.querySelector('p'); if(p) p.textContent=d.label||''; },
    },
    status2: {
      editorId: 'ls-schedule-cards-editor', listId: 'ls-sched-cards-list', addBtnId: 'ls-sched-cards-add-btn',
      builtinFlag: 'scheduleCards', icon: 'fa-calendar', label: 'Item',
      colors: ['yellow','yellow','yellow','yellow'],
      fields: [
        { key:'label', type:'input', placeholder:'Label e.g. WHEN:',             bold:true },
        { key:'value', type:'input', placeholder:'Value e.g. 28.05.2024' },
      ],
      hasImage: false,
      defaults: [
        { label:'WHEN:',              value:'28.05.2024' },
        { label:'Days:',              value:'Monday, Thursday (7pm - 9pm)' },
        { label:'Duration:',          value:'4 month' },
        { label:'Number of lessons:', value:'16 lessons + 1 exam' },
      ],
      addLabel:'Add Item',
      iframeSelector:'.stat-card',
      patchCard:(el,d)=>{ const b=el.querySelector('b'); if(b) b.textContent=d.label||''; const p=el.querySelector('p'); if(p) p.textContent=d.value||''; },
    },
    coach: {
      editorId: 'ls-coach-cards-editor', listId: 'ls-coach-cards-list', addBtnId: 'ls-coach-cards-add-btn',
      builtinFlag: 'coachCards', icon: 'fa-user-tie', label: 'Coach',
      colors: ['blue','yellow','green','red'],
      fields: [
        { key:'name', type:'input', placeholder:'Full Name e.g. MARIAM MARTIROSYAN', bold:true },
        { key:'role', type:'input', placeholder:'Role e.g. CEO & Founder' },
      ],
      hasImage: true,
      defaults: [
        { name:'MARIAM MARTIROSYAN', role:'CEO & Founder',     imageUrl:'' },
        { name:'LILIT HOVHANNISYAN', role:'LEGO system coach', imageUrl:'' },
        { name:'ROSA TSERUNYAN',     role:'LEGO system coach', imageUrl:'' },
        { name:'MERY POGHOSYAN',     role:'ART Teacher',       imageUrl:'' },
      ],
      addLabel:'Add Coach',
      iframeSelector:'.grid > div.flex',
      patchCard:(el,d)=>{ const h=el.querySelector('h4'); if(h) h.textContent=d.name||''; const p=el.querySelector('p'); if(p) p.textContent=d.role||''; const img=el.querySelector('img'); if(img&&d.imageUrl) img.src=d.imageUrl; },
    },
    legoeducation: {
      editorId: 'ls-testimonial-cards-editor', listId: 'ls-test-cards-list', addBtnId: 'ls-test-cards-add-btn',
      builtinFlag: 'testimonialCards', icon: 'fa-user', label: 'Card',
      colors: ['blue','yellow','green'],
      fields: [
        { key:'name',  type:'input',    placeholder:'Name',                 bold:true },
        { key:'quote', type:'textarea', placeholder:'Quote / Description…', rows:3 },
      ],
      hasImage: true,
      defaults: [
        { name:'MARIE YANK',    quote:'LEGO Education has changed the way I feel about teaching tremendously.',                                                                           imageUrl:'' },
        { name:'ALICIA MILLER', quote:'Two of the skills most important in the real world are critical thinking and problem solving — both fostered through LEGO Education.',              imageUrl:'' },
        { name:'JANE DOE',      quote:'The courses are fantastic! My child has learned so much and has developed a real passion for building and problem-solving.',                        imageUrl:'' },
      ],
      addLabel:'Add Card',
      iframeSelector:'.flex.flex-wrap > div',
      patchCard:(el,d)=>{ const p=el.querySelector('p.italic,p[class*="italic"]'); if(p) p.textContent=`"${d.quote||''}"`;  const h=el.querySelector('h5'); if(h) h.textContent=d.name||''; const img=el.querySelector('img'); if(img&&d.imageUrl) img.src=d.imageUrl; },
    },
    trainers: {
      editorId: 'ls-trainer-cards-editor', listId: 'ls-tr-cards-list', addBtnId: 'ls-tr-cards-add-btn',
      builtinFlag: 'trainerCards', icon: 'fa-chalkboard-teacher', label: 'Trainer',
      colors: ['blue','yellow','green','red'],
      fields: [
        { key:'name', type:'input',    placeholder:'Full Name', bold:true },
        { key:'role', type:'input',    placeholder:'Role' },
        { key:'desc', type:'textarea', placeholder:'Description…', rows:2 },
      ],
      hasImage: true,
      defaults: [
        { name:'Sara Smith',     role:'Trainer', desc:'', imageUrl:'' },
        { name:'Emily Voron',    role:'Trainer', desc:'', imageUrl:'' },
        { name:'Michael Dour',   role:'Trainer', desc:'', imageUrl:'' },
        { name:'Anna Petrosyan', role:'Trainer', desc:'', imageUrl:'' },
      ],
      addLabel:'Add Trainer',
      iframeSelector:'.flex.flex-wrap > div.flex',
      patchCard:(el,d)=>{ const h=el.querySelector('h3'); if(h) h.textContent=d.name||''; const ps=el.querySelectorAll('p'); if(ps[0]) ps[0].textContent=d.role||''; if(ps[1]) ps[1].textContent=d.desc||''; const img=el.querySelector('img'); if(img&&d.imageUrl) img.src=d.imageUrl; },
    },
    partners: {
      editorId: 'ls-partner-cards-editor', listId: 'ls-partner-cards-list', addBtnId: 'ls-partner-cards-add-btn',
      builtinFlag: 'partnerCards', icon: 'fa-handshake', label: 'Partner',
      colors: ['purple','blue','green','yellow'],
      fields: [
        { key:'name',    type:'input', placeholder:'Partner name e.g. LEGO Education', bold:true },
        { key:'logoUrl', type:'input', placeholder:'Logo image URL' },
        { key:'link',    type:'input', placeholder:'Website URL (optional)' },
      ],
      hasImage: false,
      defaults: [
        { name:'LEGO Education', logoUrl:'', link:'' },
      ],
      addLabel:'Add Partner',
      iframeSelector:'.ls-partner-item',
      patchCard:(el,d)=>{ const img=el.querySelector('img'); if(img&&d.logoUrl) img.src=d.logoUrl; const nm=el.querySelector('span'); if(nm) nm.textContent=d.name||''; },
    },
    projects: {
      editorId: 'ls-project-cards-editor', listId: 'ls-project-cards-list', addBtnId: 'ls-project-cards-add-btn',
      builtinFlag: 'projectCards', icon: 'fa-project-diagram', label: 'Project',
      colors: ['blue','purple','green','yellow','red','indigo'],
      fields: [
        { key:'title', type:'input',    placeholder:'Project title e.g. Basics of graphic design', bold:true },
        { key:'desc',  type:'textarea', placeholder:'Short description (optional)', rows:2 },
      ],
      hasImage: false,
      defaults: [
        { title:'Basics of graphic design',           desc:'' },
        { title:'3D effects',                         desc:'' },
        { title:'Branches of graphic design',         desc:'' },
        { title:'Adobe Illustrator, Adobe Photoshop', desc:'' },
        { title:'Brandbook creation',                 desc:'' },
        { title:'Work with printing companies',       desc:'' },
      ],
      addLabel:'Add Project',
      iframeSelector:'.project-card',
      patchCard:(el,d)=>{ const h=el.querySelector('h4'); if(h) h.textContent=d.title||''; const p=el.querySelector('p'); if(p) p.textContent=d.desc||''; },
    },
  };

  // ── Dynamic Card Engine ────────────────────────────────────────────
  function buildCardItemEl(bk, data, index) {
    const cfg = CARD_CONFIGS[bk];
    if (!cfg) return null;
    const palette = cfg.colors ? cfg.colors[index % cfg.colors.length] : 'blue';
    const p = CARD_PALETTE[palette] || CARD_PALETTE.blue;

    const wrap = document.createElement('div');
    wrap.className = `ls-card-item border ${p.border} rounded-xl p-3 ${p.bg} space-y-2`;
    wrap.dataset.cardBk = bk;

    // Header with label + remove button
    const hdr = document.createElement('div');
    hdr.className = 'flex items-center justify-between';
    hdr.innerHTML = `
      <p class="text-xs font-bold ${p.text} uppercase flex items-center gap-1.5">
        <i class="fas ${cfg.icon}"></i>
        <span>${cfg.label} ${index + 1}</span>
      </p>
      <button type="button" class="ls-remove-card-btn p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all" title="Remove">
        <i class="fas fa-trash-alt text-xs"></i>
      </button>`;
    wrap.appendChild(hdr);

    // Fields
    for (const f of cfg.fields) {
      const val = (data && data[f.key] != null) ? data[f.key] : '';
      if (f.type === 'textarea') {
        const ta = document.createElement('textarea');
        ta.dataset.field = f.key;
        ta.rows = f.rows || 2;
        ta.className = `w-full px-3 py-2 ${p.inp} rounded-lg text-gray-700 text-xs ${p.ring} bg-white resize-none transition-all`;
        ta.placeholder = f.placeholder || '';
        ta.value = val;
        wrap.appendChild(ta);
      } else {
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.dataset.field = f.key;
        inp.className = `w-full px-3 py-2 ${p.inp} rounded-lg text-xs ${f.bold ? 'font-semibold text-gray-900' : 'text-gray-600'} ${p.ring} bg-white transition-all`;
        inp.placeholder = f.placeholder || '';
        inp.value = val;
        wrap.appendChild(inp);
      }
    }

    // Image slot
    if (cfg.hasImage) {
      const imgUrl = (data && data.imageUrl) ? data.imageUrl : '';
      const previewId = `ls-ci-${bk}-${index}-${Math.random().toString(36).slice(2,7)}`;
      wrap.dataset.previewId = previewId;
      const imgWrap = document.createElement('div');
      imgWrap.className = 'flex items-center gap-2 mt-1';
      imgWrap.innerHTML = `
        <label class="relative w-10 h-10 rounded-full border-2 border-dashed ${p.imgBorder} hover:border-blue-500 cursor-pointer overflow-hidden flex-shrink-0 bg-white flex items-center justify-center">
          <img id="${previewId}" src="${imgUrl ? escH(imgUrl) : ''}" alt="" class="absolute inset-0 w-full h-full object-cover rounded-full${imgUrl ? '' : ' hidden'}">
          <i class="fas fa-camera ${p.text} text-sm${imgUrl ? ' hidden' : ''}"></i>
          <input type="file" data-field-file="imageUrl" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
        </label>
        <div class="flex-1 flex items-center gap-1 border ${p.inp} rounded-lg px-2 py-1.5 bg-white focus-within:ring-1 ${p.ring}">
          <i class="fas fa-link text-gray-300 flex-shrink-0 text-xs"></i>
          <input type="text" data-field="imageUrl" value="${escH(imgUrl)}" class="flex-1 border-0 outline-none bg-transparent text-gray-500 text-xs" placeholder="Photo URL or upload ←">
        </div>`;
      wrap.appendChild(imgWrap);
      const prog = document.createElement('div');
      prog.className = 'ls-card-img-progress hidden mt-1 text-xs text-indigo-600 flex items-center gap-1';
      prog.innerHTML = '<i class="fas fa-spinner fa-spin text-xs"></i> Uploading…';
      wrap.appendChild(prog);
    }

    return wrap;
  }

  function bindCardItemEvents(cardEl) {
    // Remove button
    const removeBtn = cardEl.querySelector('.ls-remove-card-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        const listEl = cardEl.parentElement;
        cardEl.remove();
        if (listEl) {
          listEl.querySelectorAll('.ls-card-item').forEach((el, i) => {
            const bk2 = el.dataset.cardBk;
            const cfg2 = bk2 ? CARD_CONFIGS[bk2] : null;
            const span = el.querySelector('p > span');
            if (span && cfg2) span.textContent = `${cfg2.label} ${i + 1}`;
          });
        }
        scheduleDrawerPatch();
      });
    }
    // Field input → live preview
    cardEl.querySelectorAll('[data-field]').forEach(inp => {
      inp.addEventListener('input', scheduleDrawerPatch);
    });
    // Image URL typed → update preview
    const imgUrlInp = cardEl.querySelector('[data-field="imageUrl"]');
    if (imgUrlInp) {
      imgUrlInp.addEventListener('input', () => {
        const pid = cardEl.dataset.previewId;
        const preview = pid ? document.getElementById(pid) : null;
        const cam = cardEl.querySelector('.fa-camera');
        const url = imgUrlInp.value.trim();
        if (preview) { if (url) { preview.src = url; preview.classList.remove('hidden'); if (cam) cam.classList.add('hidden'); } else { preview.classList.add('hidden'); if (cam) cam.classList.remove('hidden'); } }
      });
    }
    // File upload
    const fileInp = cardEl.querySelector('[data-field-file]');
    if (fileInp) {
      fileInp.addEventListener('change', () => {
        if (fileInp.files[0]) uploadCardImageDyn(fileInp.files[0], cardEl);
        fileInp.value = '';
      });
    }
  }

  async function uploadCardImageDyn(file, cardEl) {
    const prog = cardEl.querySelector('.ls-card-img-progress');
    if (prog) prog.classList.remove('hidden');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/upload/image', { method:'POST', body:fd });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      const imgInp = cardEl.querySelector('[data-field="imageUrl"]');
      if (imgInp) { imgInp.value = url; imgInp.dispatchEvent(new Event('input')); }
      scheduleDrawerPatch();
      showToast('Image uploaded!', 'success');
    } catch { showToast('Upload failed', 'error'); }
    finally { if (prog) prog.classList.add('hidden'); }
  }

  function renderCardList(bk, items) {
    const cfg = CARD_CONFIGS[bk];
    if (!cfg) return;
    const listEl = document.getElementById(cfg.listId);
    if (!listEl) return;
    listEl.innerHTML = '';
    items.forEach((data, i) => {
      const el = buildCardItemEl(bk, data, i);
      if (el) { bindCardItemEvents(el); listEl.appendChild(el); }
    });
  }

  function addCardItem(bk) {
    const cfg = CARD_CONFIGS[bk];
    if (!cfg) return;
    const listEl = document.getElementById(cfg.listId);
    if (!listEl) return;
    const index = listEl.querySelectorAll('.ls-card-item').length;
    const el = buildCardItemEl(bk, {}, index);
    if (el) { bindCardItemEvents(el); listEl.appendChild(el); scheduleDrawerPatch(); }
  }

  function collectCardList(bk) {
    const cfg = CARD_CONFIGS[bk];
    if (!cfg) return [];
    const listEl = document.getElementById(cfg.listId);
    if (!listEl) return [];
    return Array.from(listEl.querySelectorAll('.ls-card-item')).map(cardEl => {
      const data = {};
      cardEl.querySelectorAll('[data-field]').forEach(inp => { data[inp.dataset.field] = inp.value.trim(); });
      return data;
    });
  }

  function applyFormConfig(builtinKey) {
    const ALL_TABS = ['content', 'media', 'style', 'settings', 'translations'];
    const cfg = builtinKey ? (BUILTIN_FORM[builtinKey] || null) : null;
    const showTabs = cfg ? cfg.tabs : ALL_TABS;

    // Tab buttons: show/hide and ensure first visible tab is active
    let firstVisibleTab = null;
    ALL_TABS.forEach(tab => {
      const btn = document.getElementById(`ls-tab-btn-${tab}`);
      const pane = document.querySelector(`.ls-tab-pane[data-pane="${tab}"]`);
      if (!btn) return;
      const visible = showTabs.includes(tab);
      btn.style.display = visible ? '' : 'none';
      if (visible && !firstVisibleTab) firstVisibleTab = tab;
    });
    // Activate first visible tab
    if (firstVisibleTab) {
      document.querySelectorAll('.ls-drawer-tab').forEach(t => {
        t.classList.remove('active', 'text-indigo-600', 'border-indigo-600', 'bg-white');
        t.classList.add('text-gray-500', 'border-transparent');
      });
      document.querySelectorAll('.ls-tab-pane').forEach(p => p.classList.add('hidden'));
      const activeBtn = document.getElementById(`ls-tab-btn-${firstVisibleTab}`);
      const activePane = document.querySelector(`.ls-tab-pane[data-pane="${firstVisibleTab}"]`);
      if (activeBtn) { activeBtn.classList.add('active', 'text-indigo-600', 'border-indigo-600', 'bg-white'); activeBtn.classList.remove('text-gray-500', 'border-transparent'); }
      if (activePane) activePane.classList.remove('hidden');
    }

    if (!cfg) {
      // Default: show all fields
      ['type','title','subtitle','body','button'].forEach(f => { const el = document.getElementById(`ls-field-${f}`); if (el) el.style.display = ''; });
      if (dCardsEditor)       dCardsEditor.classList.add('hidden');
      if (dStatCardsEditor)   dStatCardsEditor.classList.add('hidden');
      if (dSchedCardsEditor)  dSchedCardsEditor.classList.add('hidden');
      if (dCoachCardsEditor)  dCoachCardsEditor.classList.add('hidden');
      if (dTestCardsEditor)   dTestCardsEditor.classList.add('hidden');
      if (dTrainerCardsEditor)dTrainerCardsEditor.classList.add('hidden');
      if (dPartnerCardsEditor)dPartnerCardsEditor.classList.add('hidden');
      if (dProjectCardsEditor)dProjectCardsEditor.classList.add('hidden');
      if (dGridSectionEditor) dGridSectionEditor.classList.add('hidden');
      return;
    }

    // Type field
    const typeEl = document.getElementById('ls-field-type');
    if (typeEl) typeEl.style.display = cfg.type === false ? 'none' : '';

    // Title
    const titleEl = document.getElementById('ls-field-title');
    if (titleEl) titleEl.style.display = cfg.title ? '' : 'none';
    const titleLabel = document.getElementById('ls-field-title-label');
    if (titleLabel && cfg.title) titleLabel.textContent = cfg.title;

    // Subtitle
    const subEl = document.getElementById('ls-field-subtitle');
    if (subEl) subEl.style.display = cfg.subtitle ? '' : 'none';
    const subLabel = document.getElementById('ls-field-subtitle-label');
    if (subLabel && cfg.subtitle) subLabel.textContent = cfg.subtitle;

    // Body
    const bodyEl = document.getElementById('ls-field-body');
    if (bodyEl) bodyEl.style.display = cfg.body ? '' : 'none';
    const bodyLabel = document.getElementById('ls-field-body-label');
    if (bodyLabel && cfg.body) bodyLabel.textContent = cfg.body;

    // Rich text vs plain textarea
    if (cfg.richText && cfg.body) {
      if (dBody) dBody.style.display = 'none';
      if (dBodyQuillWrap) dBodyQuillWrap.classList.remove('hidden');
      getOrInitQuill();
    } else {
      if (dBody) dBody.style.display = '';
      if (dBodyQuillWrap) dBodyQuillWrap.classList.add('hidden');
    }

    // Cards editor
    if (dCardsEditor) dCardsEditor.classList.toggle('hidden', !cfg.cards);

    // Stat cards editor
    if (dStatCardsEditor)  dStatCardsEditor.classList.toggle('hidden',  !cfg.statCards);

    // Schedule cards editor
    if (dSchedCardsEditor) dSchedCardsEditor.classList.toggle('hidden', !cfg.scheduleCards);

    // Coach cards editor
    if (dCoachCardsEditor) dCoachCardsEditor.classList.toggle('hidden', !cfg.coachCards);

    // Testimonial cards editor
    if (dTestCardsEditor) dTestCardsEditor.classList.toggle('hidden', !cfg.testimonialCards);

    // Trainer cards editor
    if (dTrainerCardsEditor) dTrainerCardsEditor.classList.toggle('hidden', !cfg.trainerCards);

    // Partner cards editor
    if (dPartnerCardsEditor) dPartnerCardsEditor.classList.toggle('hidden', !cfg.partnerCards);

    // Project cards editor
    if (dProjectCardsEditor) dProjectCardsEditor.classList.toggle('hidden', !cfg.projectCards);

    // Grid section editor (about)
    if (dGridSectionEditor) dGridSectionEditor.classList.toggle('hidden', !cfg.gridImages);

    // Single image mode: hide IMAGE 2 and IMAGE 3 blocks
    const img2Block = document.getElementById('ls-media-img2-block');
    const img3Block = document.getElementById('ls-media-img3-block');
    if (img2Block) img2Block.style.display = cfg.singleImage ? 'none' : '';
    if (img3Block) img3Block.style.display = cfg.singleImage ? 'none' : '';

    // Button (in Style tab)
    const btnEl = document.getElementById('ls-field-button');
    if (btnEl) btnEl.style.display = cfg.button ? '' : 'none';
  }

  // ── Translation field visibility ───────────────────────────────────
  function applyTranslationVisibility(builtinKey) {
    const locMap = LOCALE_MAP[builtinKey] || null;
    ['title', 'subtitle', 'body'].forEach(f => {
      const hasField = !!(locMap && locMap.fields[f]);
      ['ru', 'hy'].forEach(lang => {
        const wrap = document.getElementById(`ls-tr-${lang}-${f}-wrap`);
        if (wrap) wrap.style.display = hasField ? '' : 'none';
      });
    });
  }

  // ── Load translation fields from locale JSON files ─────────────────
  async function loadTranslationFields(builtinKey) {
    const locMap = LOCALE_MAP[builtinKey];
    const allFields = [dTrRuTitle, dTrRuSubtitle, dTrRuBody, dTrHyTitle, dTrHySubtitle, dTrHyBody];
    allFields.forEach(el => { if (el) el.value = ''; });
    if (!locMap) return;
    try {
      const [ruData, hyData] = await Promise.all([
        fetch('/locales/ru.json').then(r => r.json()).catch(() => ({})),
        fetch('/locales/hy.json').then(r => r.json()).catch(() => ({})),
      ]);
      const ruSec = ruData[locMap.section] || {};
      const hySec = hyData[locMap.section] || {};
      const fm = locMap.fields;
      if (dTrRuTitle    && fm.title)    dTrRuTitle.value    = ruSec[fm.title]    || '';
      if (dTrRuSubtitle && fm.subtitle) dTrRuSubtitle.value = ruSec[fm.subtitle] || '';
      if (dTrRuBody     && fm.body)     dTrRuBody.value     = ruSec[fm.body]     || '';
      if (dTrHyTitle    && fm.title)    dTrHyTitle.value    = hySec[fm.title]    || '';
      if (dTrHySubtitle && fm.subtitle) dTrHySubtitle.value = hySec[fm.subtitle] || '';
      if (dTrHyBody     && fm.body)     dTrHyBody.value     = hySec[fm.body]     || '';
    } catch (e) { /* silently ignore */ }
  }

  // ── Save translations: manual overrides first, then auto-translate ──
  async function saveTranslations(builtinKey) {
    const locMap = LOCALE_MAP[builtinKey];
    if (!locMap) return;
    const fm = locMap.fields;

    // Collect manual translation values from the Translate tab
    const manualRu = {};
    const manualHy = {};
    if (fm.title) {
      const rv = dTrRuTitle    ? dTrRuTitle.value.trim()    : '';
      const hv = dTrHyTitle    ? dTrHyTitle.value.trim()    : '';
      if (rv) manualRu[fm.title] = rv;
      if (hv) manualHy[fm.title] = hv;
    }
    if (fm.subtitle) {
      const rv = dTrRuSubtitle ? dTrRuSubtitle.value.trim() : '';
      const hv = dTrHySubtitle ? dTrHySubtitle.value.trim() : '';
      if (rv) manualRu[fm.subtitle] = rv;
      if (hv) manualHy[fm.subtitle] = hv;
    }
    if (fm.body) {
      const rv = dTrRuBody     ? dTrRuBody.value.trim()     : '';
      const hv = dTrHyBody     ? dTrHyBody.value.trim()     : '';
      if (rv) manualRu[fm.body] = rv;
      if (hv) manualHy[fm.body] = hv;
    }

    // Determine which fields need auto-translation (no manual value entered)
    const textsToAutoTranslate = {};
    if (fm.title    && !manualRu[fm.title]    && !manualHy[fm.title])    { const v = dTitle    ? dTitle.value.trim()    : ''; if (v) textsToAutoTranslate.title    = v; }
    if (fm.subtitle && !manualRu[fm.subtitle] && !manualHy[fm.subtitle]) { const v = dSubtitle ? dSubtitle.value.trim() : ''; if (v) textsToAutoTranslate.subtitle = v; }
    if (fm.body     && !manualRu[fm.body]     && !manualHy[fm.body])     { const v = dBody     ? dBody.value.trim()     : ''; if (v) textsToAutoTranslate.body     = v; }

    // Auto-translate fields that have no manual translation
    if (Object.keys(textsToAutoTranslate).length > 0) {
      try {
        showToast('Translating…', 'info');
        await fetch('/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            texts: textsToAutoTranslate,
            localeSection: locMap.section,
            localeFields: fm,
          }),
        });
        // Reload translation fields to show auto-translated values
        await loadTranslationFields(builtinKey);
      } catch (e) { /* auto-translate failed — silently continue */ }
    }

    // Apply any manual overrides on top of auto-translations
    const promises = [];
    if (Object.keys(manualRu).length > 0) {
      promises.push(fetch('/locales/ru', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [locMap.section]: manualRu }),
      }));
    }
    if (Object.keys(manualHy).length > 0) {
      promises.push(fetch('/locales/hy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [locMap.section]: manualHy }),
      }));
    }
    if (promises.length > 0) await Promise.all(promises);
  }

  // ── Init ──────────────────────────────────────────────────────────
  window.loadLandingSections = loadSections;

  function init() {
    if (!list) return;
    renderSystemSections();
    bindModal();
    bindAddButtons();
    bindTypeSelect();
    bindImageUpload();
    bindColorPickers();
    bindVisibleToggle();
    bindViewportToggle();
    bindPropsDrawer();
    if (refreshBtn) refreshBtn.addEventListener('click', refreshPreview);

    window.addEventListener('load', () => {
      const pg = document.getElementById('pages-content');
      if (pg && !pg.classList.contains('hidden')) loadSections();
    });
  }

  init();

  // ── System sections (clickable sidebar items) ──────────────────────
  function renderSystemSections() {
    if (!systemList) return;
    systemList.innerHTML = '';

    SYSTEM_SECTIONS.forEach((s, i) => {
      const tc = TYPE_COLORS[s.color] || TYPE_COLORS.gray;
      const item = document.createElement('div');
      item.className = 'sys-sec-item flex items-center gap-2 px-2 py-1.5 mx-1 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 border border-transparent transition-all cursor-pointer group';
      item.dataset.anchorId = s.anchorId;
      item.dataset.idx = i;
      item.innerHTML = `
        <span class="w-5 h-5 flex items-center justify-center flex-shrink-0">
          ${s.iconImg ? `<img src="${s.iconImg}" class="w-4 h-4 object-contain rounded" alt="">` : `<i class="fas ${s.icon} text-xs text-gray-400 group-hover:text-indigo-500 transition-colors"></i>`}
        </span>
        <span class="flex-1 text-xs text-gray-600 group-hover:text-indigo-700 font-medium truncate transition-colors">${s.name}</span>
        <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 ${tc.dot} opacity-50"></span>
        <i class="fas fa-arrow-right text-indigo-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"></i>
      `;
      item.addEventListener('click', () => openSystemSection(s, item));
      systemList.appendChild(item);
    });
  }

  // ── System section click: scroll iframe + show info panel ──────────
  let activeSystemItem = null;

  function openSystemSection(s, itemEl) {
    // Highlight sidebar item
    document.querySelectorAll('.sys-sec-item').forEach(el => {
      el.classList.remove('bg-indigo-50', 'border-indigo-300', 'shadow-sm');
    });
    itemEl.classList.add('bg-indigo-50', 'border-indigo-300', 'shadow-sm');
    activeSystemItem = itemEl;

    // Scroll iframe to section
    scrollIframeTo(s.anchorId);

    // Show info panel + open drawer if editable
    showSectionInfoPanel(s);
    if (s.builtinKey) openBuiltinEditModal(s);
    else scrollIframeTo(s.anchorId);
  }

  function scrollIframeTo(anchorId) {
    if (!iframe) return;
    const tryScroll = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        const el = doc.getElementById(anchorId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Flash highlight
          const prev = el.style.cssText;
          el.style.outline = '3px solid #6366f1';
          el.style.outlineOffset = '2px';
          el.style.borderRadius = '4px';
          el.style.transition = 'outline 0.5s';
          setTimeout(() => { el.style.outline = ''; el.style.outlineOffset = ''; }, 2000);
        }
      } catch (e) { /* cross-origin guard */ }
    };

    // If iframe already loaded, scroll immediately; otherwise wait
    if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
      tryScroll();
    } else {
      iframe.addEventListener('load', tryScroll, { once: true });
    }
  }

  // ── Section Info Panel (slides in at bottom of left panel) ─────────
  function showSectionInfoPanel(s) {
    let panel = document.getElementById('ls-sys-info-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'ls-sys-info-panel';
      panel.className = 'border-t border-indigo-100 bg-white';

      // Insert before the section type palette (last child of left panel's flex parent)
      const leftPanel = systemList.closest('.flex-col');
      if (!leftPanel) return;
      // insert before the last two children (the palette + custom sections area)
      const paletteEl = leftPanel.querySelector('.border-t.border-gray-200.bg-white');
      if (paletteEl) leftPanel.insertBefore(panel, paletteEl);
      else leftPanel.appendChild(panel);
    }

    const tc = TYPE_COLORS[s.color] || TYPE_COLORS.gray;
    panel.innerHTML = `
      <div class="px-4 py-3">
        <div class="flex items-start justify-between gap-2 mb-2">
          <div class="flex items-center gap-2">
            <span class="w-7 h-7 flex items-center justify-center rounded-lg ${tc.badge}">
              <i class="fas ${SYSTEM_SECTIONS.find(x=>x.name===s.name)?.icon||'fa-layer-group'} text-xs"></i>
            </span>
            <div>
              <p class="text-xs font-bold text-gray-800 leading-tight">${s.name}</p>
              <p class="text-xs text-indigo-500 font-semibold">Built-in Section</p>
            </div>
          </div>
          <button id="ls-info-panel-close" class="w-5 h-5 flex items-center justify-center rounded text-gray-300 hover:text-gray-600 transition-colors flex-shrink-0 mt-0.5">
            <i class="fas fa-times text-xs"></i>
          </button>
        </div>
        <p class="text-xs text-gray-500 leading-relaxed mb-3">${s.desc}</p>
        <div class="flex items-center gap-1.5 flex-wrap">
          ${s.builtinKey ? `
          <button class="ls-builtin-edit-btn inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors">
            <i class="fas fa-pencil-alt text-xs"></i> Edit Section
          </button>
          ` : `
          <span class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-500 text-xs font-medium">
            <i class="fas fa-lock text-xs"></i> Read-only
          </span>
          `}
          <button class="ls-scroll-to-btn inline-flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-50 text-indigo-600 text-xs font-semibold hover:bg-indigo-100 transition-colors" data-anchor="${s.anchorId}">
            <i class="fas fa-crosshairs text-xs"></i> Focus in preview
          </button>
        </div>
      </div>
    `;

    panel.querySelector('#ls-info-panel-close').addEventListener('click', () => {
      panel.remove();
      document.querySelectorAll('.sys-sec-item').forEach(el => el.classList.remove('bg-indigo-50', 'border-indigo-300', 'shadow-sm'));
      activeSystemItem = null;
    });
    panel.querySelector('.ls-scroll-to-btn').addEventListener('click', () => scrollIframeTo(s.anchorId));
    if (s.builtinKey) {
      panel.querySelector('.ls-builtin-edit-btn').addEventListener('click', () => openBuiltinEditModal(s));
    }
  }

  // ── Open properties drawer for a built-in section ─────────────────
  async function openBuiltinEditModal(s) {
    try {
      const res = await fetch(`${API}/builtin/${encodeURIComponent(s.builtinKey)}`);
      if (res.ok) {
        const section = await res.json();
        // Always use the primary anchor so live patch can find the element in the iframe
        openPropsDrawer(section, s.anchorId, s);
        return;
      }
      // 404 = no DB record yet — open drawer for new record
      openPropsDrawer(null, s.anchorId, s);
    } catch (err) {
      openPropsDrawer(null, s.anchorId, s);
    }
  }

  // ── Load & render custom sections ─────────────────────────────────
  async function loadSections() {
    showLoading();
    try {
      const res = await fetch(`${API}?limit=200&page=1`);
      const result = await res.json();
      sections = (result.data || []).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      renderSections();
    } catch (err) {
      console.error('Landing editor: failed to load', err);
      showEmpty();
    }
  }

  function renderSections() {
    list.querySelectorAll('.ls-card').forEach(el => el.remove());

    const total = SYSTEM_SECTIONS.length + sections.length;
    if (countEl) countEl.textContent = `${total} sections`;
    if (customCountEl) customCountEl.textContent = sections.length;

    if (sections.length === 0) { showEmpty(); return; }
    hideLoading(); hideEmpty();

    sections.forEach((section, idx) => {
      list.appendChild(buildSidebarItem(section, idx));
    });
  }

  // ── Sidebar item for custom sections ──────────────────────────────
  function buildSidebarItem(section, idx) {
    const meta = SECTION_TYPES[section.sectionType] || SECTION_TYPES.custom;
    const tc   = TYPE_COLORS[meta.color] || TYPE_COLORS.gray;
    const isFirst = idx === 0;
    const isLast  = idx === sections.length - 1;

    const item = document.createElement('div');
    item.className = 'ls-card group relative flex items-center gap-2 mx-1 mb-1 px-2 py-2 rounded-xl border border-transparent hover:border-indigo-200 hover:bg-indigo-50 transition-all cursor-grab active:cursor-grabbing';
    item.dataset.id = section.id;
    item.draggable = true;

    item.innerHTML = `
      <!-- Drag handle -->
      <div class="ls-drag-handle flex flex-col gap-0.5 opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0 select-none">
        <span class="block w-3 h-0.5 bg-gray-500 rounded"></span>
        <span class="block w-3 h-0.5 bg-gray-500 rounded"></span>
        <span class="block w-3 h-0.5 bg-gray-500 rounded"></span>
      </div>

      <!-- Color swatch + icon -->
      <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border"
           style="background-color:${escH(section.backgroundColor||'#fff')};">
        <i class="fas ${meta.icon} text-xs" style="color:${escH(section.textColor||'#1f2937')};"></i>
      </div>

      <!-- Title & type -->
      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold text-gray-800 truncate leading-tight">
          ${section.title ? escH(section.title) : `<span class="text-gray-400 italic font-normal">${meta.label}</span>`}
        </p>
        <div class="flex items-center gap-1 mt-0.5">
          <span class="text-xs ${tc.badge} px-1.5 py-0.5 rounded-md font-semibold leading-none">${meta.label}</span>
          ${!section.isVisible ? `<span class="text-xs text-gray-400"><i class="fas fa-eye-slash"></i></span>` : ''}
        </div>
      </div>

      <!-- Actions (visible on hover) -->
      <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button class="ls-toggle-btn w-6 h-6 flex items-center justify-center rounded-md transition-all ${section.isVisible ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'}"
                data-id="${section.id}" title="Toggle visibility">
          <i class="fas ${section.isVisible ? 'fa-eye' : 'fa-eye-slash'} text-xs"></i>
        </button>
        <button class="ls-move-up-btn w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-all ${isFirst ? 'opacity-30 pointer-events-none' : ''}"
                data-id="${section.id}" title="Move up">
          <i class="fas fa-chevron-up text-xs"></i>
        </button>
        <button class="ls-move-down-btn w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-all ${isLast ? 'opacity-30 pointer-events-none' : ''}"
                data-id="${section.id}" title="Move down">
          <i class="fas fa-chevron-down text-xs"></i>
        </button>
        <button class="ls-edit-btn w-6 h-6 flex items-center justify-center rounded-md text-indigo-500 hover:bg-indigo-100 transition-all"
                data-id="${section.id}" title="Edit">
          <i class="fas fa-pencil-alt text-xs"></i>
        </button>
        <button class="ls-delete-btn w-6 h-6 flex items-center justify-center rounded-md text-red-400 hover:bg-red-50 transition-all"
                data-id="${section.id}" title="Delete">
          <i class="fas fa-trash text-xs"></i>
        </button>
      </div>
    `;

    // Bind buttons
    item.querySelector('.ls-toggle-btn').addEventListener('click', e => { e.stopPropagation(); toggleVisibility(section); });
    item.querySelector('.ls-edit-btn').addEventListener('click', e => { e.stopPropagation(); openPropsDrawer(section, null, null); });
    item.querySelector('.ls-delete-btn').addEventListener('click', e => { e.stopPropagation(); deleteSection(section.id); });
    const upBtn = item.querySelector('.ls-move-up-btn');
    const downBtn = item.querySelector('.ls-move-down-btn');
    if (!isFirst) upBtn.addEventListener('click', e => { e.stopPropagation(); moveSection(section.id, -1); });
    if (!isLast)  downBtn.addEventListener('click', e => { e.stopPropagation(); moveSection(section.id, 1); });

    // Drag-and-drop
    item.addEventListener('dragstart', onDragStart);
    item.addEventListener('dragover',  onDragOver);
    item.addEventListener('dragleave', onDragLeave);
    item.addEventListener('drop',      onDrop);
    item.addEventListener('dragend',   onDragEnd);

    return item;
  }

  // ── Drag and Drop ─────────────────────────────────────────────────
  function onDragStart(e) {
    dragSrcId = this.dataset.id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragSrcId);
    this.classList.add('opacity-50', 'border-indigo-300');
  }

  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    this.classList.add('border-indigo-400', 'bg-indigo-50');
  }

  function onDragLeave() {
    this.classList.remove('border-indigo-400', 'bg-indigo-50');
  }

  async function onDrop(e) {
    e.preventDefault();
    this.classList.remove('border-indigo-400', 'bg-indigo-50');
    const targetId = this.dataset.id;
    if (!dragSrcId || dragSrcId === targetId) return;

    const srcIdx = sections.findIndex(s => s.id === dragSrcId);
    const tgtIdx = sections.findIndex(s => s.id === targetId);
    if (srcIdx < 0 || tgtIdx < 0) return;

    // Reorder in memory
    const [moved] = sections.splice(srcIdx, 1);
    sections.splice(tgtIdx, 0, moved);

    // Assign new sortOrder values and persist
    try {
      await Promise.all(sections.map((s, i) => updateSection(s.id, { sortOrder: i * 10 })));
      showToast('Order saved', 'success');
      await loadSections();
      refreshPreview();
    } catch {
      showToast('Failed to save order', 'error');
    }
  }

  function onDragEnd() {
    this.classList.remove('opacity-50', 'border-indigo-300');
    list.querySelectorAll('.ls-card').forEach(el => el.classList.remove('border-indigo-400', 'bg-indigo-50'));
    dragSrcId = null;
  }

  // ── API calls ─────────────────────────────────────────────────────
  async function createSection(data) {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Create failed');
    return res.json();
  }

  async function updateSection(id, data) {
    const res = await fetch(`${API}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Update failed');
    return res.json();
  }

  async function deleteSection(id) {
    const ok = await window.confirm('Delete this section?');
    if (!ok) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('Section deleted', 'success');
      await loadSections();
      refreshPreview();
    } catch { showToast('Delete failed', 'error'); }
  }

  async function toggleVisibility(section) {
    try {
      await updateSection(section.id, { isVisible: !section.isVisible });
      showToast(section.isVisible ? 'Section hidden' : 'Section visible', 'success');
      await loadSections();
      refreshPreview();
    } catch { showToast('Failed', 'error'); }
  }

  async function moveSection(id, dir) {
    const idx = sections.findIndex(s => s.id === id);
    if (idx < 0) return;
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= sections.length) return;
    const a = sections[idx], b = sections[swapIdx];
    const ao = a.sortOrder ?? idx * 10, bo = b.sortOrder ?? swapIdx * 10;
    try {
      await Promise.all([
        updateSection(a.id, { sortOrder: bo === ao ? bo + dir : bo }),
        updateSection(b.id, { sortOrder: ao === bo ? ao - dir : ao }),
      ]);
      await loadSections();
      refreshPreview();
    } catch { showToast('Reorder failed', 'error'); }
  }

  // ── Preview iframe ─────────────────────────────────────────────────
  function refreshPreview() {
    if (!iframe) return;
    iframe.src = iframe.src;
  }

  function bindViewportToggle() {
    document.querySelectorAll('.ls-vp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.ls-vp-btn').forEach(b => {
          b.classList.remove('bg-white', 'text-gray-800', 'shadow-sm', 'active');
          b.classList.add('text-gray-500');
        });
        btn.classList.add('bg-white', 'text-gray-800', 'shadow-sm', 'active');
        btn.classList.remove('text-gray-500');

        if (!previewWrap) return;
        const vp = btn.dataset.vp;
        if (vp === 'desktop') {
          previewWrap.style.width = '100%';
          previewWrap.style.maxWidth = '';
          previewWrap.style.margin = '';
        } else if (vp === 'tablet') {
          previewWrap.style.width = '768px';
          previewWrap.style.maxWidth = '100%';
          previewWrap.style.margin = '0 auto';
        } else {
          previewWrap.style.width = '390px';
          previewWrap.style.maxWidth = '100%';
          previewWrap.style.margin = '0 auto';
        }
      });
    });
  }

  // ── Modal ──────────────────────────────────────────────────────────
  function openAddModal(type) {
    form.reset();
    idInput.value = '';
    pendingBuiltinKey = pendingBuiltinKey; // preserve if set before calling this
    submitLabel.textContent = 'Create Section';

    const meta = SECTION_TYPES[type] || SECTION_TYPES.custom;
    modalTitle.textContent = `Add ${meta.label} Section`;
    modalSub.textContent = 'Fill in the fields below';
    typeSelect.value = type;
    updateModalIcon(type);
    updateFields(type);

    bgColorInput.value = meta.bg;
    txColorInput.value = meta.text;
    syncColorUI();
    setImagePreview('');

    const maxOrder = sections.reduce((m, s) => Math.max(m, s.sortOrder ?? 0), 0);
    document.getElementById('ls-sortOrder').value = maxOrder + 10;
    isVisCheck.checked = true;
    visLabel.textContent = 'On';

    if (builtinBadge) {
      if (pendingBuiltinKey) builtinBadge.classList.replace('hidden', 'flex');
      else builtinBadge.classList.replace('flex', 'hidden');
    }

    openModal();
  }

  function openEditModal(section) {
    // Route all editing through the properties drawer
    const anchorId = section.builtinKey ? `sec-${section.builtinKey}` : `sec-custom-${section.id}`;
    openPropsDrawer(section, anchorId, null);
  }

  function updateModalIcon(type) {
    const meta = SECTION_TYPES[type] || SECTION_TYPES.custom;
    const bgMap = { yellow:'bg-yellow-100', blue:'bg-blue-100', green:'bg-green-100', purple:'bg-purple-100', red:'bg-red-100', pink:'bg-pink-100', gray:'bg-gray-100' };
    const txMap = { yellow:'text-yellow-600', blue:'text-blue-600', green:'text-green-600', purple:'text-purple-600', red:'text-red-600', pink:'text-pink-600', gray:'text-gray-600' };
    modalIcon.className = `w-10 h-10 rounded-xl flex items-center justify-center ${bgMap[meta.color]||'bg-indigo-100'}`;
    modalIcon.innerHTML = `<i class="fas ${meta.icon} ${txMap[meta.color]||'text-indigo-600'}"></i>`;
  }

  function updateFields(type) {
    const cfg = FIELD_CONFIG[type] || FIELD_CONFIG.custom;

    const subtitleField = document.getElementById('ls-field-subtitle');
    subtitleField.style.display = cfg.subtitle ? '' : 'none';
    if (cfg.subtitle) document.getElementById('ls-subtitle-label').textContent = cfg.subtitle;

    const bodyField = document.getElementById('ls-field-body');
    bodyField.style.display = cfg.body ? '' : 'none';
    if (cfg.body) document.getElementById('ls-body-label').textContent = cfg.body;
    document.getElementById('ls-body-hint').textContent = type === 'custom'
      ? 'HTML is allowed — rendered directly on the page.'
      : 'Plain text. Line breaks are supported.';

    const imageField = document.getElementById('ls-field-image');
    imageField.style.display = cfg.image ? '' : 'none';
    if (cfg.image) document.getElementById('ls-image-label').textContent = cfg.image;

    const buttonField = document.getElementById('ls-field-button');
    buttonField.style.display = cfg.button ? '' : 'none';
  }

  function openModal()  { modal.classList.remove('hidden'); document.body.style.overflow = 'hidden'; setTimeout(()=>document.getElementById('ls-title').focus(), 80); }
  function closeModal() { modal.classList.add('hidden');    document.body.style.overflow = ''; pendingBuiltinKey = null; }

  // ── Form submit ────────────────────────────────────────────────────
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const id   = idInput.value;
    const type = typeSelect.value;
    const cfg  = FIELD_CONFIG[type] || FIELD_CONFIG.custom;

    const data = {
      sectionType:     type,
      title:           document.getElementById('ls-title').value || null,
      subtitle:        cfg.subtitle ? (document.getElementById('ls-subtitle').value || null) : null,
      body:            cfg.body     ? (document.getElementById('ls-body').value || null) : null,
      imageUrl:        cfg.image    ? (imageUrlInput.value || null) : null,
      buttonText:      cfg.button   ? (document.getElementById('ls-buttonText').value || null) : null,
      buttonLink:      cfg.button   ? (document.getElementById('ls-buttonLink').value || null) : null,
      backgroundColor: document.getElementById('ls-backgroundColor').value,
      textColor:       document.getElementById('ls-textColor').value,
      sortOrder:       parseInt(document.getElementById('ls-sortOrder').value) || 0,
      isVisible:       isVisCheck.checked,
      ...(pendingBuiltinKey ? { builtinKey: pendingBuiltinKey } : {}),
    };

    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Saving…';

    try {
      if (id) { await updateSection(id, data); showToast('Section updated!', 'success'); }
      else    { await createSection(data);    showToast('Section created!', 'success'); }
      closeModal();
      await loadSections();
      refreshPreview();
    } catch { showToast('Save failed', 'error'); }
    finally {
      btn.disabled = false;
      btn.innerHTML = `<i class="fas fa-save"></i> <span id="ls-submit-label">${id ? 'Save Changes' : 'Create Section'}</span>`;
    }
  });

  // ── Event bindings ─────────────────────────────────────────────────
  function bindModal() {
    document.getElementById('ls-modal-close').addEventListener('click', closeModal);
    document.getElementById('ls-modal-cancel').addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  }

  function bindAddButtons() {
    const addBtn = document.getElementById('add-landing-section-btn');
    if (addBtn) addBtn.addEventListener('click', () => openAddModal('hero'));

    const addBtnEmpty = document.getElementById('add-landing-section-btn-empty');
    if (addBtnEmpty) addBtnEmpty.addEventListener('click', () => openAddModal('hero'));

    document.querySelectorAll('.add-section-type-btn').forEach(btn => {
      btn.addEventListener('click', () => openAddModal(btn.dataset.type));
    });
  }

  function bindTypeSelect() {
    typeSelect.addEventListener('change', () => {
      const type = typeSelect.value;
      updateModalIcon(type);
      updateFields(type);
      if (!idInput.value) {
        const meta = SECTION_TYPES[type] || SECTION_TYPES.custom;
        bgColorInput.value = meta.bg;
        txColorInput.value = meta.text;
        syncColorUI();
      }
    });
  }

  // ── Image Upload ───────────────────────────────────────────────────
  function bindImageUpload() {
    if (!fileInput) return;

    // Click on drop zone opens file picker
    dropZone.addEventListener('click', e => {
      if (e.target !== fileInput) fileInput.click();
    });

    // Drag & drop
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('border-indigo-400', 'bg-indigo-50'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('border-indigo-400', 'bg-indigo-50'));
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      dropZone.classList.remove('border-indigo-400', 'bg-indigo-50');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) uploadFile(file);
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files[0]) uploadFile(fileInput.files[0]);
    });

    // URL input live preview
    let t;
    imageUrlInput.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => setImagePreview(imageUrlInput.value), 400);
    });
  }

  async function uploadFile(file) {
    if (!uploadProgress) return;
    uploadProgress.classList.remove('hidden');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/upload/image', { method: 'POST', body: fd });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      imageUrlInput.value = url;
      setImagePreview(url);
      showToast('Image uploaded!', 'success');
    } catch {
      showToast('Upload failed', 'error');
    } finally {
      uploadProgress.classList.add('hidden');
    }
  }

  function setImagePreview(url) {
    const wrap = document.getElementById('ls-image-preview-wrap');
    const img  = document.getElementById('ls-image-preview');
    if (!wrap || !img) return;
    if (url && url.trim()) {
      img.src = url;
      wrap.classList.remove('hidden');
      dropPlaceholder && dropPlaceholder.classList.add('hidden');
      img.onerror = () => { wrap.classList.add('hidden'); dropPlaceholder && dropPlaceholder.classList.remove('hidden'); };
    } else {
      wrap.classList.add('hidden');
      dropPlaceholder && dropPlaceholder.classList.remove('hidden');
    }
  }

  // ── Color Pickers ──────────────────────────────────────────────────
  function bindColorPickers() {
    if (!bgColorInput) return;

    const syncColors = () => {
      const bg = bgColorInput.value;
      const tx = txColorInput.value;
      if (bgHexInput) bgHexInput.value = bg;
      if (txHexInput) txHexInput.value = tx;
      if (colorPreview) colorPreview.style.background = bg;
      if (colorPrevTitle) colorPrevTitle.style.color = tx;
      if (colorPrevSub) colorPrevSub.style.color = tx;
    };

    bgColorInput.addEventListener('input', syncColors);
    txColorInput.addEventListener('input', syncColors);

    // Hex text inputs sync back to color pickers
    if (bgHexInput) bgHexInput.addEventListener('input', () => {
      if (/^#[0-9a-fA-F]{6}$/.test(bgHexInput.value)) { bgColorInput.value = bgHexInput.value; syncColors(); }
    });
    if (txHexInput) txHexInput.addEventListener('input', () => {
      if (/^#[0-9a-fA-F]{6}$/.test(txHexInput.value)) { txColorInput.value = txHexInput.value; syncColors(); }
    });
  }

  function syncColorUI() {
    if (!bgColorInput) return;
    const bg = bgColorInput.value;
    const tx = txColorInput.value;
    if (bgHexInput) bgHexInput.value = bg;
    if (txHexInput) txHexInput.value = tx;
    if (colorPreview) colorPreview.style.background = bg;
    if (colorPrevTitle) colorPrevTitle.style.color = tx;
    if (colorPrevSub) colorPrevSub.style.color = tx;
  }

  function bindVisibleToggle() {
    isVisCheck.addEventListener('change', () => { visLabel.textContent = isVisCheck.checked ? 'On' : 'Off'; });
  }

  // ── UI state ───────────────────────────────────────────────────────
  function showLoading() {
    loadingEl.classList.remove('hidden');
    emptyEl.classList.add('hidden');
    list.querySelectorAll('.ls-card').forEach(el => el.remove());
  }
  function hideLoading() { loadingEl.classList.add('hidden'); }
  function showEmpty()   { loadingEl.classList.add('hidden'); emptyEl.classList.remove('hidden'); emptyEl.classList.add('flex'); }
  function hideEmpty()   { emptyEl.classList.add('hidden'); emptyEl.classList.remove('flex'); }

  // ── Toast ──────────────────────────────────────────────────────────
  function showToast(msg, type = 'success') {
    document.querySelectorAll('.ls-toast').forEach(t => t.remove());
    const el = document.createElement('div');
    const bg = type === 'success' ? 'bg-gray-900' : type === 'info' ? 'bg-indigo-600' : 'bg-red-600';
    const ic = type === 'success' ? 'fa-check-circle text-green-400' : type === 'info' ? 'fa-language text-white' : 'fa-exclamation-circle';
    el.className = `ls-toast fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-5 py-3.5 ${bg} text-white text-sm font-semibold rounded-2xl shadow-2xl`;
    el.innerHTML = `<i class="fas ${ic}"></i> ${msg}`;
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(12px)'; el.style.transition = 'all .3s'; setTimeout(() => el.remove(), 300); }, 2800);
  }

  // ══════════════════════════════════════════════════════════════════
  // PROPERTIES DRAWER — real-time inline editor
  // ══════════════════════════════════════════════════════════════════

  function bindPropsDrawer() {
    if (!drawer) return;

    // Close button
    document.getElementById('ls-drawer-close').addEventListener('click', closeDrawer);

    // Save button
    document.getElementById('ls-drawer-save').addEventListener('click', saveDrawer);

    // Tab switching
    document.querySelectorAll('.ls-drawer-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.ls-drawer-tab').forEach(t => {
          t.classList.remove('active', 'text-indigo-600', 'border-indigo-600', 'bg-white');
          t.classList.add('text-gray-500', 'border-transparent');
        });
        tab.classList.add('active', 'text-indigo-600', 'border-indigo-600', 'bg-white');
        tab.classList.remove('text-gray-500', 'border-transparent');
        const pane = tab.dataset.tab;
        document.querySelectorAll('.ls-tab-pane').forEach(p => p.classList.add('hidden'));
        document.querySelector(`.ls-tab-pane[data-pane="${pane}"]`).classList.remove('hidden');
      });
    });

    // Real-time field changes → patch iframe
    const liveFields = [dTitle, dSubtitle, dBody, dBtnText, dBtnLink];
    liveFields.forEach(f => { if (f) f.addEventListener('input', scheduleDrawerPatch); });

    // Colors
    if (dBgColor) dBgColor.addEventListener('input', () => { if (dBgHex) dBgHex.value = dBgColor.value; syncDrawerColorPreview(); scheduleDrawerPatch(); });
    if (dTxColor) dTxColor.addEventListener('input', () => { if (dTxHex) dTxHex.value = dTxColor.value; syncDrawerColorPreview(); scheduleDrawerPatch(); });
    if (dBgHex) dBgHex.addEventListener('input', () => { if (/^#[0-9a-fA-F]{6}$/.test(dBgHex.value)) { dBgColor.value = dBgHex.value; syncDrawerColorPreview(); scheduleDrawerPatch(); }});
    if (dTxHex) dTxHex.addEventListener('input', () => { if (/^#[0-9a-fA-F]{6}$/.test(dTxHex.value)) { dTxColor.value = dTxHex.value; syncDrawerColorPreview(); scheduleDrawerPatch(); }});

    // Visibility
    if (dVisible) dVisible.addEventListener('change', () => {
      dVisLabel.textContent = dVisible.checked ? 'Visible' : 'Hidden';
    });

    // Image URL inputs
    function bindImageUrlInput(input, setPreviewFn) {
      if (!input) return;
      let t;
      input.addEventListener('input', () => {
        clearTimeout(t);
        t = setTimeout(() => { setPreviewFn(input.value); scheduleDrawerPatch(); }, 400);
      });
    }
    bindImageUrlInput(dImageUrl,  url => setDrawerImagePreview(url, 1));
    bindImageUrlInput(dImageUrl2, url => setDrawerImagePreview(url, 2));
    bindImageUrlInput(dImageUrl3, url => setDrawerImagePreview(url, 3));

    // Add card buttons — bind for all card types
    Object.entries(CARD_CONFIGS).forEach(([bk, cc]) => {
      const addBtn = document.getElementById(cc.addBtnId);
      if (addBtn) addBtn.addEventListener('click', () => addCardItem(bk));
    });

    // Remove buttons
    if (dImg1Remove) dImg1Remove.addEventListener('click', () => {
      if (dImageUrl) dImageUrl.value = '';
      setDrawerImagePreview('', 1);
      scheduleDrawerPatch();
    });
    if (dImg2Remove) dImg2Remove.addEventListener('click', () => {
      if (dImageUrl2) dImageUrl2.value = '';
      setDrawerImagePreview('', 2);
      scheduleDrawerPatch();
    });
    if (dImg3Remove) dImg3Remove.addEventListener('click', () => {
      if (dImageUrl3) dImageUrl3.value = '';
      setDrawerImagePreview('', 3);
      scheduleDrawerPatch();
    });

    // File upload in drawer - helper
    function bindDropzone(dropzone, fileInput, uploadFn) {
      if (!dropzone || !fileInput) return;
      dropzone.addEventListener('click', e => { if (e.target !== fileInput) fileInput.click(); });
      dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('border-indigo-400', 'bg-indigo-50'); });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('border-indigo-400', 'bg-indigo-50'));
      dropzone.addEventListener('drop', e => {
        e.preventDefault(); dropzone.classList.remove('border-indigo-400', 'bg-indigo-50');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) uploadFn(file);
      });
      fileInput.addEventListener('change', () => { if (fileInput.files[0]) uploadFn(fileInput.files[0]); });
    }
    bindDropzone(dDropzone,  dFileInput,  file => uploadDrawerFile(file, 1));
    bindDropzone(dDropzone2, dFileInput2, file => uploadDrawerFile(file, 2));
    bindDropzone(dDropzone3, dFileInput3, file => uploadDrawerFile(file, 3));

    // Bind grid image file inputs (about section)
    dGridImgSlots.forEach(slot => {
      if (!slot.file) return;
      slot.file.addEventListener('change', () => {
        if (slot.file.files[0]) uploadGridImage(slot.file.files[0], slot);
        slot.file.value = '';
      });
      if (slot.url) slot.url.addEventListener('input', () => setGridImagePreview(slot.url.value, slot));
    });
    if (dGridDesc) dGridDesc.addEventListener('input', scheduleDrawerPatch);
  }

  async function uploadDrawerFile(file, slot) {
    const progressEl = slot === 2 ? dUploadProgress2 : slot === 3 ? dUploadProgress3 : dUploadProgress;
    if (!progressEl) return;
    progressEl.classList.remove('hidden');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/upload/image', { method: 'POST', body: fd });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      if (slot === 2 && dImageUrl2) { dImageUrl2.value = url; }
      else if (slot === 3 && dImageUrl3) { dImageUrl3.value = url; }
      else if (dImageUrl) { dImageUrl.value = url; }
      setDrawerImagePreview(url, slot || 1);
      scheduleDrawerPatch();
      showToast('Image uploaded!', 'success');
    } catch { showToast('Upload failed', 'error'); }
    finally { progressEl.classList.add('hidden'); }
  }

  // Generic card image upload (coach & testimonial slots)
  async function uploadCardImage(file, urlEl, progressEl, previewEl) {
    if (!file) return;
    if (progressEl) progressEl.classList.remove('hidden');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/upload/image', { method: 'POST', body: fd });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      if (urlEl) urlEl.value = url;
      setCardImagePreview(url, previewEl);
      scheduleDrawerPatch();
      showToast('Image uploaded!', 'success');
    } catch { showToast('Upload failed', 'error'); }
    finally { if (progressEl) progressEl.classList.add('hidden'); }
  }

  function setCardImagePreview(url, previewEl) {
    if (!previewEl) return;
    if (url && url.trim()) {
      previewEl.src = url;
      previewEl.style.display = '';
      previewEl.onerror = () => { previewEl.style.display = 'none'; };
    } else {
      previewEl.src = '';
      previewEl.style.display = 'none';
    }
  }

  function setGridImagePreview(url, slot) {
    if (!slot) return;
    if (url && url.trim()) {
      if (slot.preview) { slot.preview.src = url; slot.preview.style.display = ''; slot.preview.onerror = () => { slot.preview.style.display = 'none'; if (slot.placeholder) slot.placeholder.style.display = ''; }; }
      if (slot.placeholder) slot.placeholder.style.display = 'none';
    } else {
      if (slot.preview) { slot.preview.src = ''; slot.preview.style.display = 'none'; }
      if (slot.placeholder) slot.placeholder.style.display = '';
    }
  }

  async function uploadGridImage(file, slot) {
    if (!file || !slot.progress) return;
    slot.progress.classList.remove('hidden');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/upload/image', { method: 'POST', body: fd });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      if (slot.url) slot.url.value = url;
      setGridImagePreview(url, slot);
      scheduleDrawerPatch();
      showToast('Image uploaded!', 'success');
    } catch { showToast('Upload failed', 'error'); }
    finally { slot.progress.classList.add('hidden'); }
  }

  function setDrawerImagePreview(url, slot) {
    const wrap        = slot === 2 ? dImgWrap2        : slot === 3 ? dImgWrap3        : dImgWrap;
    const preview     = slot === 2 ? dImgPreview2     : slot === 3 ? dImgPreview3     : dImgPreview;
    const placeholder = slot === 2 ? dImgPlaceholder2 : slot === 3 ? dImgPlaceholder3 : dImgPlaceholder;
    const removeBtn   = slot === 2 ? dImg2Remove      : slot === 3 ? dImg3Remove      : dImg1Remove;
    if (!wrap || !preview) return;
    if (url && url.trim()) {
      preview.src = url;
      wrap.classList.remove('hidden');
      placeholder && placeholder.classList.add('hidden');
      removeBtn && removeBtn.classList.remove('hidden');
      preview.onerror = () => {
        wrap.classList.add('hidden');
        placeholder && placeholder.classList.remove('hidden');
        removeBtn && removeBtn.classList.add('hidden');
      };
    } else {
      wrap.classList.add('hidden');
      placeholder && placeholder.classList.remove('hidden');
      removeBtn && removeBtn.classList.add('hidden');
    }
  }

  function syncDrawerColorPreview() {
    if (!dColorPrev) return;
    const bg = dBgColor ? dBgColor.value : '#1e3a5f';
    const tx = dTxColor ? dTxColor.value : '#ffffff';
    dColorPrev.style.background = bg;
    if (dPrevTitle) dPrevTitle.style.color = tx;
    if (dPrevSub)   dPrevSub.style.color   = tx;
    if (dPrevBtn)   { dPrevBtn.style.background = tx; dPrevBtn.style.color = bg; }
    // Also sync hex inputs
    if (dBgHex && document.activeElement !== dBgHex) dBgHex.value = bg;
    if (dTxHex && document.activeElement !== dTxHex) dTxHex.value = tx;
  }

  function scheduleDrawerPatch() {
    clearTimeout(drawerDebounceTimer);
    drawerDebounceTimer = setTimeout(patchIframeSection, 300);
  }

  // Patch the targeted section in the iframe DOM without full reload
  function patchIframeSection() {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const anchorId = drawerAnchor ? drawerAnchor.value : '';
      const sectionId = drawerIdIn ? drawerIdIn.value : '';

      // Find root element: try data-section-id first (custom/dynamic), then anchor id
      let root = sectionId ? doc.querySelector(`[data-section-id="${sectionId}"]`) : null;
      if (!root && anchorId) root = doc.getElementById(anchorId);
      if (!root) return;

      const bg = dBgColor ? dBgColor.value : '';
      const tx = dTxColor ? dTxColor.value : '';
      const title    = dTitle    ? dTitle.value    : '';
      const subtitle = dSubtitle ? dSubtitle.value : '';
      const body     = dBody     ? dBody.value     : '';
      const imgUrl   = dImageUrl ? dImageUrl.value : '';
      const btnText  = dBtnText  ? dBtnText.value  : '';
      const btnLink  = dBtnLink  ? dBtnLink.value  : '';

      // Background & text color on root + inner section
      const inner = root.querySelector('section.dynamic-section') || root;
      if (bg) { root.style.backgroundColor = bg; inner.style.backgroundColor = bg; }
      if (tx) { root.style.color = tx; inner.style.color = tx; }

      // Determine active cfg to know which fields are visible
      const _bk = drawerBuiltin ? drawerBuiltin.value : '';
      const _cfg = _bk ? (BUILTIN_FORM[_bk] || null) : null;
      const _hasSubtitle = !_cfg || !!_cfg.subtitle;
      const _hasBody     = !_cfg || !!_cfg.body;

      // Title (only patch if form has a title field)
      const _hasTitle = !_cfg || !!_cfg.title;
      if (_hasTitle && title !== undefined) {
        const h = root.querySelector('h1, h2, h3, h4');
        if (h) { h.textContent = title; if (tx) h.style.color = tx; }
      }
      // Subtitle (only patch if subtitle field is shown in form)
      if (_hasSubtitle && subtitle !== undefined) {
        const allP = root.querySelectorAll('p');
        if (allP.length > 0) allP[0].textContent = subtitle;
      }
      // Body
      if (_hasBody && body !== undefined) {
        const allP = root.querySelectorAll('p');
        // If subtitle is hidden, body is the FIRST p; otherwise it's the second
        const pIdx = _hasSubtitle ? 1 : 0;
        if (allP.length > pIdx) allP[pIdx].textContent = body;
        const bq = root.querySelector('blockquote');
        if (bq) bq.textContent = `"${body}"`;
      }
      // Image
      if (imgUrl) {
        const img = root.querySelector('img');
        if (img) img.src = imgUrl;
        // Hero-style background image — check inner element and root itself
        const bgEl = inner.querySelector('[style*="background-image"]') || (inner.style.backgroundImage ? inner : null) || (root.style.backgroundImage ? root : null);
        if (bgEl) bgEl.style.backgroundImage = `url('${imgUrl}')`;
      }
      // Button
      if (btnText !== undefined) {
        const btn = root.querySelector('a.inline-block, a[class*="rounded"]');
        if (btn) { btn.textContent = btnText; if (btnLink) btn.href = btnLink; }
      }

      // ── Card-specific real-time patches ─────────────────────────────────
      const _cc = CARD_CONFIGS[_bk];
      if (_cc) {
        const cards = collectCardList(_bk);
        const cardEls = root.querySelectorAll(_cc.iframeSelector);
        cardEls.forEach((el, i) => { if (cards[i]) _cc.patchCard(el, cards[i]); });
      }
      // ────────────────────────────────────────────────────────────────────

      // Scroll to section & flash highlight
      root.scrollIntoView({ behavior: 'smooth', block: 'center' });
      root.style.outline = '3px solid #6366f1';
      root.style.outlineOffset = '2px';
      root.style.borderRadius = '4px';
      setTimeout(() => { root.style.outline = ''; root.style.outlineOffset = ''; }, 1500);
    } catch(e) { /* cross-origin guard */ }
  }

  // Open properties drawer for a section (custom or builtin)
  function openPropsDrawer(section, anchorId, systemSection) {
    if (!drawer) return;

    // Reset tabs to content
    document.querySelectorAll('.ls-drawer-tab').forEach(t => {
      t.classList.remove('active', 'text-indigo-600', 'border-indigo-600', 'bg-white');
      t.classList.add('text-gray-500', 'border-transparent');
    });
    const firstTab = document.querySelector('.ls-drawer-tab[data-tab="content"]');
    if (firstTab) { firstTab.classList.add('active', 'text-indigo-600', 'border-indigo-600', 'bg-white'); firstTab.classList.remove('text-gray-500', 'border-transparent'); }
    document.querySelectorAll('.ls-tab-pane').forEach(p => p.classList.add('hidden'));
    const contentPane = document.querySelector('.ls-tab-pane[data-pane="content"]');
    if (contentPane) contentPane.classList.remove('hidden');

    // Set hidden state
    drawerIdIn.value     = section ? (section.id || '') : '';
    drawerAnchor.value   = anchorId || '';
    drawerBuiltin.value  = section ? (section.builtinKey || '') : (systemSection ? systemSection.builtinKey || '' : '');

    // Determine builtin key for form config
    const builtinKeyNow = section ? (section.builtinKey || '') : (systemSection ? systemSection.builtinKey || '' : '');

    // Apply section-specific form layout
    applyFormConfig(builtinKeyNow);
    applyTranslationVisibility(builtinKeyNow);
    loadTranslationFields(builtinKeyNow);

    // Get form config and defaults for this section
    const cfg = builtinKeyNow ? (BUILTIN_FORM[builtinKeyNow] || null) : null;
    const d   = (!section && cfg && cfg.defaults) ? cfg.defaults : {};

    // Fill fields — use DB values if record exists, otherwise use template defaults
    const meta = section ? (SECTION_TYPES[section.sectionType] || SECTION_TYPES.custom) : SECTION_TYPES.custom;
    dType.value     = section ? (section.sectionType || 'custom') : (systemSection ? systemSection.defaultType || 'custom' : 'custom');
    dTitle.value    = section ? (section.title    || '') : (d.title    || '');
    dSubtitle.value = section ? (section.subtitle || '') : (d.subtitle || '');
    const bodyContent = section ? (section.body || '') : (d.body || '');
    dBody.value = bodyContent;
    if (cfg && cfg.richText) {
      const q = getOrInitQuill();
      if (q) q.root.innerHTML = bodyContent;
    }
    dBtnText.value  = section ? (section.buttonText || '') : (d.buttonText || '');
    dBtnLink.value  = section ? (section.buttonLink || '') : (d.buttonLink || '');

    // Load dynamic card data for any card-based section
    const activeCc = CARD_CONFIGS[builtinKeyNow];
    if (activeCc) {
      let items = [];
      try { items = JSON.parse(section && section.body ? section.body : '[]') || []; } catch {}
      const hasBody = !!(section && section.body);
      renderCardList(builtinKeyNow, items.length > 0 ? items : (hasBody ? [] : activeCc.defaults));
    }

    // Load grid section data (about / Transform Education)
    if (cfg && cfg.gridImages) {
      let gdata = {};
      try { gdata = JSON.parse(section && section.body ? section.body : '{}') || {}; } catch {}
      const isJsonObj = gdata && typeof gdata === 'object' && !Array.isArray(gdata);
      const defaultText = 'By inviting joy and curiosity into the classroom, we can enable all students and educators to thrive, developing the skills needed to build a better world for themselves and for others.';
      const imgDefaults = [
        '/images/pexels-a-darmel-7750686.png',
        '/images/pexels-a-darmel-7750701.png',
        '/images/pexels-a-darmel-7750704.png',
        '/images/pexels-a-darmel-7750701.png',
        '/images/pexels-a-darmel-7750686.png',
        '/images/pexels-a-darmel-7750701.png',
      ];
      const hasBody = section && section.body;
      if (dGridDesc) dGridDesc.value = (isJsonObj && gdata.text) ? gdata.text : (hasBody && !isJsonObj ? section.body : defaultText);
      dGridImgSlots.forEach((slot, i) => {
        const key = `img${i + 1}`;
        const url = (isJsonObj && gdata[key]) ? gdata[key] : (hasBody && isJsonObj ? '' : imgDefaults[i]);
        if (slot.url) slot.url.value = url;
        setGridImagePreview(url, slot);
      });
    }

    dOrder.value     = section ? (section.sortOrder ?? 0) : 0;
    dVisible.checked = section ? (section.isVisible !== false) : true;
    dVisLabel.textContent = dVisible.checked ? 'Visible' : 'Hidden';

    const bg = section ? (section.backgroundColor || meta.bg) : (d.backgroundColor || meta.bg);
    const tx = section ? (section.textColor       || meta.text) : (d.textColor      || meta.text);
    dBgColor.value = bg;
    dTxColor.value = tx;
    syncDrawerColorPreview();

    const img1 = section ? (section.imageUrl  || '') : (d.imageUrl  || '');
    const img2 = section ? (section.imageUrl2 || '') : (d.imageUrl2 || '');
    const img3 = section ? (section.imageUrl3 || '') : (d.imageUrl3 || '');
    if (dImageUrl)  dImageUrl.value  = img1;
    if (dImageUrl2) dImageUrl2.value = img2;
    if (dImageUrl3) dImageUrl3.value = img3;
    setDrawerImagePreview(img1, 1);
    setDrawerImagePreview(img2, 2);
    setDrawerImagePreview(img3, 3);

    // Update header
    const name = systemSection ? systemSection.name : (section ? (section.title || meta.label + ' Section') : 'Section');
    drawerTitle.textContent = name;
    drawerSub.textContent = section ? 'Edit section · real-time preview' : (cfg && cfg.defaults ? 'Prefilled with current content · save to override' : 'New section');
    if (drawerIcon) {
      const bgMap = { yellow:'bg-yellow-100', blue:'bg-blue-100', green:'bg-green-100', purple:'bg-purple-100', red:'bg-red-100', pink:'bg-pink-100', gray:'bg-gray-100' };
      const txMap = { yellow:'text-yellow-600', blue:'text-blue-600', green:'text-green-600', purple:'text-purple-600', red:'text-red-600', pink:'text-pink-600', gray:'text-gray-600' };
      const ic = systemSection ? systemSection.icon : meta.icon;
      const cl = systemSection ? systemSection.color : meta.color;
      drawerIcon.className = `w-8 h-8 rounded-lg flex items-center justify-center ${bgMap[cl] || 'bg-indigo-100'} flex-shrink-0`;
      drawerIcon.innerHTML = `<i class="fas ${ic || 'fa-layer-group'} ${txMap[cl] || 'text-indigo-600'} text-xs"></i>`;
    }

    // Builtin info
    const bk = drawerBuiltin.value;
    if (dBuiltinInfo) {
      if (bk) { dBuiltinInfo.classList.remove('hidden'); if (dBuiltinKeyLabel) dBuiltinKeyLabel.textContent = bk; }
      else dBuiltinInfo.classList.add('hidden');
    }

    // Open drawer
    drawer.style.width = '420px';
    if (liveBadge) liveBadge.classList.replace('hidden', 'flex');

    // Scroll iframe to section
    setTimeout(() => {
      scrollIframeTo(anchorId || ('sec-' + drawerBuiltin.value));
    }, 100);
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.style.width = '0';
    if (liveBadge) liveBadge.classList.replace('flex', 'hidden');
    // Remove highlight from iframe
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      const anchorId = drawerAnchor.value;
      const el = doc.getElementById(anchorId);
      if (el) { el.style.outline = ''; el.style.outlineOffset = ''; }
    } catch(e) {}
  }

  async function saveDrawer() {
    const id        = drawerIdIn.value;
    const builtinKey= drawerBuiltin.value;
    const saveBtn   = document.getElementById('ls-drawer-save');

    // Serialize card fields to JSON if cards editor is active
    const cfgNow = builtinKey ? (BUILTIN_FORM[builtinKey] || null) : null;
    // Sync rich text editor → body before saving
    if (cfgNow && cfgNow.richText && quillInstance) {
      dBody.value = quillInstance.root.innerHTML;
    }
    let bodyValue = dBody ? (dBody.value || null) : null;
    const activeCc2 = CARD_CONFIGS[builtinKey];
    if (activeCc2) {
      bodyValue = JSON.stringify(collectCardList(builtinKey));
    }
    if (cfgNow && cfgNow.gridImages) {
      const gdata = { text: (dGridDesc?.value || '').trim() };
      dGridImgSlots.forEach((slot, i) => { gdata[`img${i + 1}`] = (slot.url?.value || '').trim(); });
      bodyValue = JSON.stringify(gdata);
    }

    const data = {
      sectionType:     dType.value,
      title:           dTitle.value || null,
      subtitle:        dSubtitle.value || null,
      body:            bodyValue,
      imageUrl:        dImageUrl  ? (dImageUrl.value  || null) : null,
      imageUrl2:       dImageUrl2 ? (dImageUrl2.value || null) : null,
      imageUrl3:       dImageUrl3 ? (dImageUrl3.value || null) : null,
      buttonText:      dBtnText.value || null,
      buttonLink:      dBtnLink.value || null,
      backgroundColor: dBgColor.value,
      textColor:       dTxColor.value,
      sortOrder:       parseInt(dOrder.value) || 0,
      isVisible:       dVisible.checked,
      ...(builtinKey ? { builtinKey } : {}),
    };

    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
      if (id) { await updateSection(id, data); showToast('Saved!', 'success'); }
      else    { const created = await createSection(data); drawerIdIn.value = created[0]?.id || created.id || ''; showToast('Section created!', 'success'); }
      await loadSections();
      refreshPreview();
      saveTranslations(builtinKey).catch(() => {});
    } catch { showToast('Save failed', 'error'); }
    finally { saveBtn.disabled = false; saveBtn.innerHTML = '<i class="fas fa-save"></i> Save'; }
  }

  // ── Utils ──────────────────────────────────────────────────────────
  function escH(s) {
    if (s == null) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

})();
