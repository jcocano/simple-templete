// Ready-made example templates surfaced in Examples gallery.
// Each starter (g1-g11) returns a real `doc` with header/hero/body/CTA/footer
// so the thumbnail (rendered via stDocThumb.DocThumb) is a faithful preview
// of what the user gets when they pick it.
//
// All content is i18n-keyed under `gallery.tpl.<id>.*`. The seed doc is built
// at pick time using the current language; once the user picks a starter, the
// doc is persisted with literal strings (no further re-translation).

const baseSection = (over = {}) => ({
  bg: '#ffffff',
  text: '#1a1a17',
  padding: 32,
  font: 'inter',
  align: 'left',
  outerBg: 'transparent',
  outerPadY: 0,
  width: 600,
  ...over,
});

const headerBlock = (id, brand, sub) => ({
  id,
  type: 'header',
  data: { content: { brand, sub } },
});

const heroBlock = (id, heading, body) => ({
  id,
  type: 'hero',
  data: { content: { heading, body } },
});

const headingBlock = (id, text) => ({
  id,
  type: 'heading',
  data: { content: { text } },
});

const textBlock = (id, body) => ({
  id,
  type: 'text',
  data: { content: { body } },
});

const buttonBlock = (id, label, url) => ({
  id,
  type: 'button',
  data: { content: { label, url } },
});

const productBlock = (id, name, price) => ({
  id,
  type: 'product',
  data: { content: { name, price } },
});

const imageBlock = (id) => ({ id, type: 'image' });
const dividerBlock = (id) => ({ id, type: 'divider' });

const footerBlock = (id, company, notice) => ({
  id,
  type: 'footer',
  data: { content: { company, notice } },
});

// ============================================================================
// g1 — Newsletter mensual
// ============================================================================
function buildNewsletter(t) {
  const k = (s) => t(`gallery.tpl.g1.${s}`);
  return {
    sections: [
      {
        id: 'g1-s1', name: k('sec.header'), layout: '1col',
        style: baseSection({ bg: '#ffffff', padding: 20 }),
        columns: [{ w: 100, blocks: [headerBlock('g1-b1', k('brand'), k('sub'))] }],
      },
      {
        id: 'g1-s2', name: k('sec.hero'), layout: '1col',
        style: baseSection({ bg: '#e8e7fe', text: '#1b1547', padding: 56, align: 'left', font: 'inter-tight' }),
        columns: [{ w: 100, blocks: [heroBlock('g1-b2', k('heroH'), k('heroB'))] }],
      },
      {
        id: 'g1-s3', name: k('sec.stories'), layout: '2col',
        style: baseSection({ bg: '#ffffff', padding: 28 }),
        columns: [
          { w: 50, blocks: [
            imageBlock('g1-b3'),
            headingBlock('g1-b4', k('story1H')),
            textBlock('g1-b5', k('story1B')),
          ]},
          { w: 50, blocks: [
            imageBlock('g1-b6'),
            headingBlock('g1-b7', k('story2H')),
            textBlock('g1-b8', k('story2B')),
          ]},
        ],
      },
      {
        id: 'g1-s4', name: k('sec.calendar'), layout: '1col',
        style: baseSection({ bg: '#f5f3ec', padding: 32 }),
        columns: [{ w: 100, blocks: [
          headingBlock('g1-b9', k('calH')),
          textBlock('g1-b10', k('calB')),
          buttonBlock('g1-b11', k('calCta'), 'https://acme.com/eventos'),
        ]}],
      },
      {
        id: 'g1-s5', name: k('sec.footer'), layout: '1col',
        style: baseSection({ bg: '#f3f1fa', text: '#6a6a8a', padding: 24, align: 'center' }),
        columns: [{ w: 100, blocks: [footerBlock('g1-b12', k('footerCo'), k('footerN'))] }],
      },
    ],
  };
}

// ============================================================================
// g2 — Bienvenida
// ============================================================================
function buildWelcome(t) {
  const k = (s) => t(`gallery.tpl.g2.${s}`);
  return {
    sections: [
      {
        id: 'g2-s1', name: k('sec.header'), layout: '1col',
        style: baseSection({ bg: '#ffffff', padding: 20 }),
        columns: [{ w: 100, blocks: [headerBlock('g2-b1', k('brand'), k('sub'))] }],
      },
      {
        id: 'g2-s2', name: k('sec.hero'), layout: '1col',
        style: baseSection({ bg: '#ece3fc', text: '#2b1a52', padding: 64, align: 'left', font: 'inter-tight' }),
        columns: [{ w: 100, blocks: [heroBlock('g2-b2', k('heroH'), k('heroB'))] }],
      },
      {
        id: 'g2-s3', name: k('sec.steps'), layout: '3col',
        style: baseSection({ bg: '#ffffff', padding: 28 }),
        columns: [
          { w: 33.33, blocks: [headingBlock('g2-b3', k('s1H')), textBlock('g2-b4', k('s1B'))] },
          { w: 33.33, blocks: [headingBlock('g2-b5', k('s2H')), textBlock('g2-b6', k('s2B'))] },
          { w: 33.33, blocks: [headingBlock('g2-b7', k('s3H')), textBlock('g2-b8', k('s3B'))] },
        ],
      },
      {
        id: 'g2-s4', name: k('sec.cta'), layout: '1col',
        style: baseSection({ bg: '#f7f4fe', padding: 36, align: 'center' }),
        columns: [{ w: 100, blocks: [
          headingBlock('g2-b9', k('ctaH')),
          textBlock('g2-b10', k('ctaB')),
          buttonBlock('g2-b11', k('ctaBtn'), 'https://acme.com/onboarding'),
        ]}],
      },
      {
        id: 'g2-s5', name: k('sec.footer'), layout: '1col',
        style: baseSection({ bg: '#f3f1fa', text: '#6a6a8a', padding: 24, align: 'center' }),
        columns: [{ w: 100, blocks: [footerBlock('g2-b12', k('footerCo'), k('footerN'))] }],
      },
    ],
  };
}

// ============================================================================
// g3 — Gracias por tu compra (recibo)
// ============================================================================
function buildReceipt(t) {
  const k = (s) => t(`gallery.tpl.g3.${s}`);
  return {
    sections: [
      {
        id: 'g3-s1', name: k('sec.header'), layout: '1col',
        style: baseSection({ bg: '#ffffff', padding: 20 }),
        columns: [{ w: 100, blocks: [headerBlock('g3-b1', k('brand'), k('sub'))] }],
      },
      {
        id: 'g3-s2', name: k('sec.hero'), layout: '1col',
        style: baseSection({ bg: '#dce9f7', text: '#1a3a66', padding: 48, align: 'left', font: 'inter-tight' }),
        columns: [{ w: 100, blocks: [heroBlock('g3-b2', k('heroH'), k('heroB'))] }],
      },
      {
        id: 'g3-s3', name: k('sec.detail'), layout: '2col',
        style: baseSection({ bg: '#ffffff', padding: 28 }),
        columns: [
          { w: 60, blocks: [
            headingBlock('g3-b3', k('itemsH')),
            textBlock('g3-b4', k('itemsB')),
            dividerBlock('g3-b5'),
            headingBlock('g3-b6', k('totalH')),
          ]},
          { w: 40, blocks: [
            headingBlock('g3-b7', k('shipH')),
            textBlock('g3-b8', k('shipB')),
          ]},
        ],
      },
      {
        id: 'g3-s4', name: k('sec.cta'), layout: '1col',
        style: baseSection({ bg: '#f4f8fd', padding: 32, align: 'center' }),
        columns: [{ w: 100, blocks: [
          textBlock('g3-b9', k('ctaB')),
          buttonBlock('g3-b10', k('ctaBtn'), 'https://acme.com/pedidos/{{pedido}}'),
        ]}],
      },
      {
        id: 'g3-s5', name: k('sec.footer'), layout: '1col',
        style: baseSection({ bg: '#f1f4f8', text: '#5a6477', padding: 24, align: 'center' }),
        columns: [{ w: 100, blocks: [footerBlock('g3-b11', k('footerCo'), k('footerN'))] }],
      },
    ],
  };
}

// ============================================================================
// g4 — Promo de temporada
// ============================================================================
function buildPromo(t) {
  const k = (s) => t(`gallery.tpl.g4.${s}`);
  return {
    sections: [
      {
        id: 'g4-s1', name: k('sec.header'), layout: '1col',
        style: baseSection({ bg: '#ffffff', padding: 20 }),
        columns: [{ w: 100, blocks: [headerBlock('g4-b1', k('brand'), k('sub'))] }],
      },
      {
        id: 'g4-s2', name: k('sec.hero'), layout: '1col',
        style: baseSection({ bg: '#dde2fb', text: '#1d2a6e', padding: 72, align: 'center', font: 'inter-tight' }),
        columns: [{ w: 100, blocks: [
          heroBlock('g4-b2', k('heroH'), k('heroB')),
          buttonBlock('g4-b3', k('heroBtn'), 'https://acme.com/coleccion'),
        ]}],
      },
      {
        id: 'g4-s3', name: k('sec.products'), layout: '3col',
        style: baseSection({ bg: '#ffffff', padding: 28 }),
        columns: [
          { w: 33.33, blocks: [productBlock('g4-b4', k('p1Name'), k('p1Price'))] },
          { w: 33.33, blocks: [productBlock('g4-b5', k('p2Name'), k('p2Price'))] },
          { w: 33.33, blocks: [productBlock('g4-b6', k('p3Name'), k('p3Price'))] },
        ],
      },
      {
        id: 'g4-s4', name: k('sec.fineprint'), layout: '1col',
        style: baseSection({ bg: '#f5f6fb', padding: 24, align: 'center' }),
        columns: [{ w: 100, blocks: [textBlock('g4-b7', k('fineB'))] }],
      },
      {
        id: 'g4-s5', name: k('sec.footer'), layout: '1col',
        style: baseSection({ bg: '#f3f4fb', text: '#5a6477', padding: 24, align: 'center' }),
        columns: [{ w: 100, blocks: [footerBlock('g4-b8', k('footerCo'), k('footerN'))] }],
      },
    ],
  };
}

// ============================================================================
// g5 — Carrito abandonado
// ============================================================================
function buildCart(t) {
  const k = (s) => t(`gallery.tpl.g5.${s}`);
  return {
    sections: [
      {
        id: 'g5-s1', name: k('sec.header'), layout: '1col',
        style: baseSection({ bg: '#e9e0f7', padding: 20 }),
        columns: [{ w: 100, blocks: [headerBlock('g5-b1', k('brand'), k('sub'))] }],
      },
      {
        id: 'g5-s2', name: k('sec.hero'), layout: '1col',
        style: baseSection({ bg: '#ffffff', padding: 40, align: 'left', font: 'inter-tight' }),
        columns: [{ w: 100, blocks: [heroBlock('g5-b2', k('heroH'), k('heroB'))] }],
      },
      {
        id: 'g5-s3', name: k('sec.items'), layout: '2col',
        style: baseSection({ bg: '#ffffff', padding: 24 }),
        columns: [
          { w: 50, blocks: [productBlock('g5-b3', k('p1Name'), k('p1Price'))] },
          { w: 50, blocks: [productBlock('g5-b4', k('p2Name'), k('p2Price'))] },
        ],
      },
      {
        id: 'g5-s4', name: k('sec.incentive'), layout: '1col',
        style: baseSection({ bg: '#f6f0fb', padding: 36, align: 'center' }),
        columns: [{ w: 100, blocks: [
          headingBlock('g5-b5', k('incH')),
          textBlock('g5-b6', k('incB')),
          buttonBlock('g5-b7', k('incBtn'), 'https://acme.com/checkout'),
        ]}],
      },
      {
        id: 'g5-s5', name: k('sec.footer'), layout: '1col',
        style: baseSection({ bg: '#f3eef9', text: '#6a5a85', padding: 24, align: 'center' }),
        columns: [{ w: 100, blocks: [footerBlock('g5-b8', k('footerCo'), k('footerN'))] }],
      },
    ],
  };
}

// ============================================================================
// g6 — Encuesta de servicio
// ============================================================================
function buildSurvey(t) {
  const k = (s) => t(`gallery.tpl.g6.${s}`);
  return {
    sections: [
      {
        id: 'g6-s1', name: k('sec.header'), layout: '1col',
        style: baseSection({ bg: '#ffffff', padding: 20 }),
        columns: [{ w: 100, blocks: [headerBlock('g6-b1', k('brand'), k('sub'))] }],
      },
      {
        id: 'g6-s2', name: k('sec.hero'), layout: '1col',
        style: baseSection({ bg: '#e3e3f5', text: '#1f2050', padding: 56, align: 'left', font: 'inter-tight' }),
        columns: [{ w: 100, blocks: [heroBlock('g6-b2', k('heroH'), k('heroB'))] }],
      },
      {
        id: 'g6-s3', name: k('sec.q1'), layout: '1col',
        style: baseSection({ bg: '#ffffff', padding: 32 }),
        columns: [{ w: 100, blocks: [
          headingBlock('g6-b3', k('q1H')),
          textBlock('g6-b4', k('q1B')),
          buttonBlock('g6-b5', k('q1Btn'), 'https://acme.com/encuesta'),
        ]}],
      },
      {
        id: 'g6-s4', name: k('sec.areas'), layout: '3col',
        style: baseSection({ bg: '#f5f5fa', padding: 28 }),
        columns: [
          { w: 33.33, blocks: [headingBlock('g6-b6', k('a1H')), textBlock('g6-b7', k('a1B'))] },
          { w: 33.33, blocks: [headingBlock('g6-b8', k('a2H')), textBlock('g6-b9', k('a2B'))] },
          { w: 33.33, blocks: [headingBlock('g6-b10', k('a3H')), textBlock('g6-b11', k('a3B'))] },
        ],
      },
      {
        id: 'g6-s5', name: k('sec.footer'), layout: '1col',
        style: baseSection({ bg: '#eeeef5', text: '#5d5e7a', padding: 24, align: 'center' }),
        columns: [{ w: 100, blocks: [footerBlock('g6-b12', k('footerCo'), k('footerN'))] }],
      },
    ],
  };
}

// ============================================================================
// g7 — Recordatorio de cita
// ============================================================================
function buildAppointment(t) {
  const k = (s) => t(`gallery.tpl.g7.${s}`);
  return {
    sections: [
      {
        id: 'g7-s1', name: k('sec.header'), layout: '1col',
        style: baseSection({ bg: '#ffffff', padding: 20 }),
        columns: [{ w: 100, blocks: [headerBlock('g7-b1', k('brand'), k('sub'))] }],
      },
      {
        id: 'g7-s2', name: k('sec.hero'), layout: '1col',
        style: baseSection({ bg: '#e4eaf6', text: '#1d2a4d', padding: 56, align: 'left', font: 'inter-tight' }),
        columns: [{ w: 100, blocks: [heroBlock('g7-b2', k('heroH'), k('heroB'))] }],
      },
      {
        id: 'g7-s3', name: k('sec.detail'), layout: '2col',
        style: baseSection({ bg: '#ffffff', padding: 32 }),
        columns: [
          { w: 50, blocks: [headingBlock('g7-b3', k('whenH')), textBlock('g7-b4', k('whenB'))] },
          { w: 50, blocks: [headingBlock('g7-b5', k('whereH')), textBlock('g7-b6', k('whereB'))] },
        ],
      },
      {
        id: 'g7-s4', name: k('sec.actions'), layout: '2col',
        style: baseSection({ bg: '#f3f6fb', padding: 28, align: 'center' }),
        columns: [
          { w: 50, blocks: [buttonBlock('g7-b7', k('confirmBtn'), 'https://acme.com/citas/confirmar')] },
          { w: 50, blocks: [buttonBlock('g7-b8', k('rescheduleBtn'), 'https://acme.com/citas/reprogramar')] },
        ],
      },
      {
        id: 'g7-s5', name: k('sec.bring'), layout: '1col',
        style: baseSection({ bg: '#ffffff', padding: 24 }),
        columns: [{ w: 100, blocks: [
          headingBlock('g7-b9', k('bringH')),
          textBlock('g7-b10', k('bringB')),
        ]}],
      },
      {
        id: 'g7-s6', name: k('sec.footer'), layout: '1col',
        style: baseSection({ bg: '#f1f4f8', text: '#5a6477', padding: 24, align: 'center' }),
        columns: [{ w: 100, blocks: [footerBlock('g7-b11', k('footerCo'), k('footerN'))] }],
      },
    ],
  };
}

// ============================================================================
// g8 — Invitación a evento
// ============================================================================
function buildEvent(t) {
  const k = (s) => t(`gallery.tpl.g8.${s}`);
  return {
    sections: [
      {
        id: 'g8-s1', name: k('sec.header'), layout: '1col',
        style: baseSection({ bg: '#ffffff', padding: 20 }),
        columns: [{ w: 100, blocks: [headerBlock('g8-b1', k('brand'), k('sub'))] }],
      },
      {
        id: 'g8-s2', name: k('sec.hero'), layout: '1col',
        style: baseSection({ bg: '#ecdbea', text: '#4a1f43', padding: 72, align: 'center', font: 'instrument' }),
        columns: [{ w: 100, blocks: [heroBlock('g8-b2', k('heroH'), k('heroB'))] }],
      },
      {
        id: 'g8-s3', name: k('sec.detail'), layout: '3col',
        style: baseSection({ bg: '#ffffff', padding: 32, align: 'center' }),
        columns: [
          { w: 33.33, blocks: [headingBlock('g8-b3', k('whenH')), textBlock('g8-b4', k('whenB'))] },
          { w: 33.33, blocks: [headingBlock('g8-b5', k('whereH')), textBlock('g8-b6', k('whereB'))] },
          { w: 33.33, blocks: [headingBlock('g8-b7', k('howH')), textBlock('g8-b8', k('howB'))] },
        ],
      },
      {
        id: 'g8-s4', name: k('sec.rsvp'), layout: '1col',
        style: baseSection({ bg: '#fbf3fa', padding: 36, align: 'center' }),
        columns: [{ w: 100, blocks: [
          headingBlock('g8-b9', k('rsvpH')),
          textBlock('g8-b10', k('rsvpB')),
          buttonBlock('g8-b11', k('rsvpBtn'), 'https://acme.com/evento/rsvp'),
        ]}],
      },
      {
        id: 'g8-s5', name: k('sec.footer'), layout: '1col',
        style: baseSection({ bg: '#f5e9f3', text: '#6a4863', padding: 24, align: 'center' }),
        columns: [{ w: 100, blocks: [footerBlock('g8-b12', k('footerCo'), k('footerN'))] }],
      },
    ],
  };
}

// ============================================================================
// g9 — Aviso interno
// ============================================================================
function buildInternal(t) {
  const k = (s) => t(`gallery.tpl.g9.${s}`);
  return {
    sections: [
      {
        id: 'g9-s1', name: k('sec.header'), layout: '1col',
        style: baseSection({ bg: '#e8e5f3', padding: 20 }),
        columns: [{ w: 100, blocks: [headerBlock('g9-b1', k('brand'), k('sub'))] }],
      },
      {
        id: 'g9-s2', name: k('sec.hero'), layout: '1col',
        style: baseSection({ bg: '#ffffff', padding: 40, align: 'left', font: 'inter-tight' }),
        columns: [{ w: 100, blocks: [heroBlock('g9-b2', k('heroH'), k('heroB'))] }],
      },
      {
        id: 'g9-s3', name: k('sec.detail'), layout: '2col',
        style: baseSection({ bg: '#f6f4fb', padding: 28 }),
        columns: [
          { w: 50, blocks: [headingBlock('g9-b3', k('whenH')), textBlock('g9-b4', k('whenB'))] },
          { w: 50, blocks: [headingBlock('g9-b5', k('whereH')), textBlock('g9-b6', k('whereB'))] },
        ],
      },
      {
        id: 'g9-s4', name: k('sec.agenda'), layout: '1col',
        style: baseSection({ bg: '#ffffff', padding: 28 }),
        columns: [{ w: 100, blocks: [
          headingBlock('g9-b7', k('agendaH')),
          textBlock('g9-b8', k('agendaB')),
          buttonBlock('g9-b9', k('agendaBtn'), 'https://acme.com/intranet/q4'),
        ]}],
      },
      {
        id: 'g9-s5', name: k('sec.footer'), layout: '1col',
        style: baseSection({ bg: '#f3f1fa', text: '#6a6a8a', padding: 20, align: 'center' }),
        columns: [{ w: 100, blocks: [footerBlock('g9-b10', k('footerCo'), k('footerN'))] }],
      },
    ],
  };
}

// ============================================================================
// g10 — Cumpleaños de la marca
// ============================================================================
function buildBirthday(t) {
  const k = (s) => t(`gallery.tpl.g10.${s}`);
  return {
    sections: [
      {
        id: 'g10-s1', name: k('sec.header'), layout: '1col',
        style: baseSection({ bg: '#ffffff', padding: 20 }),
        columns: [{ w: 100, blocks: [headerBlock('g10-b1', k('brand'), k('sub'))] }],
      },
      {
        id: 'g10-s2', name: k('sec.hero'), layout: '1col',
        style: baseSection({ bg: '#f4e3db', text: '#5a2a17', padding: 72, align: 'center', font: 'instrument' }),
        columns: [{ w: 100, blocks: [heroBlock('g10-b2', k('heroH'), k('heroB'))] }],
      },
      {
        id: 'g10-s3', name: k('sec.lookbf'), layout: '2col',
        style: baseSection({ bg: '#ffffff', padding: 32 }),
        columns: [
          { w: 50, blocks: [headingBlock('g10-b3', k('backH')), textBlock('g10-b4', k('backB'))] },
          { w: 50, blocks: [headingBlock('g10-b5', k('forwardH')), textBlock('g10-b6', k('forwardB'))] },
        ],
      },
      {
        id: 'g10-s4', name: k('sec.gift'), layout: '1col',
        style: baseSection({ bg: '#fbf2ed', padding: 36, align: 'center' }),
        columns: [{ w: 100, blocks: [
          headingBlock('g10-b7', k('giftH')),
          textBlock('g10-b8', k('giftB')),
          buttonBlock('g10-b9', k('giftBtn'), 'https://acme.com/aniversario'),
        ]}],
      },
      {
        id: 'g10-s5', name: k('sec.footer'), layout: '1col',
        style: baseSection({ bg: '#f5ece6', text: '#7a5a4a', padding: 24, align: 'center' }),
        columns: [{ w: 100, blocks: [footerBlock('g10-b10', k('footerCo'), k('footerN'))] }],
      },
    ],
  };
}

// ============================================================================
// g11 — Últimos días del descuento
// ============================================================================
function buildLastDays(t) {
  const k = (s) => t(`gallery.tpl.g11.${s}`);
  return {
    sections: [
      {
        id: 'g11-s1', name: k('sec.header'), layout: '1col',
        style: baseSection({ bg: '#ffffff', padding: 20 }),
        columns: [{ w: 100, blocks: [headerBlock('g11-b1', k('brand'), k('sub'))] }],
      },
      {
        id: 'g11-s2', name: k('sec.hero'), layout: '1col',
        style: baseSection({ bg: '#f0ddd5', text: '#5e2a17', padding: 64, align: 'left', font: 'inter-tight' }),
        columns: [{ w: 100, blocks: [
          heroBlock('g11-b2', k('heroH'), k('heroB')),
          buttonBlock('g11-b3', k('heroBtn'), 'https://acme.com/oferta'),
        ]}],
      },
      {
        id: 'g11-s3', name: k('sec.products'), layout: '3col',
        style: baseSection({ bg: '#ffffff', padding: 28 }),
        columns: [
          { w: 33.33, blocks: [productBlock('g11-b4', k('p1Name'), k('p1Price'))] },
          { w: 33.33, blocks: [productBlock('g11-b5', k('p2Name'), k('p2Price'))] },
          { w: 33.33, blocks: [productBlock('g11-b6', k('p3Name'), k('p3Price'))] },
        ],
      },
      {
        id: 'g11-s4', name: k('sec.cta'), layout: '1col',
        style: baseSection({ bg: '#fbf1eb', padding: 32, align: 'center' }),
        columns: [{ w: 100, blocks: [
          headingBlock('g11-b7', k('ctaH')),
          textBlock('g11-b8', k('ctaB')),
          buttonBlock('g11-b9', k('ctaBtn'), 'https://acme.com/oferta'),
        ]}],
      },
      {
        id: 'g11-s5', name: k('sec.footer'), layout: '1col',
        style: baseSection({ bg: '#f6ece6', text: '#7a5a4a', padding: 24, align: 'center' }),
        columns: [{ w: 100, blocks: [footerBlock('g11-b10', k('footerCo'), k('footerN'))] }],
      },
    ],
  };
}

const BUILDERS = {
  g1: buildNewsletter,
  g2: buildWelcome,
  g3: buildReceipt,
  g4: buildPromo,
  g5: buildCart,
  g6: buildSurvey,
  g7: buildAppointment,
  g8: buildEvent,
  g9: buildInternal,
  g10: buildBirthday,
  g11: buildLastDays,
};

// Build the seed doc on demand using the current language. The doc is
// persisted with literal strings once the user picks a starter — the editor
// does not re-translate after that.
function seedDocFor(id, t) {
  if (!id || !BUILDERS[id]) return null;
  const tt = t || (window.stI18n && window.stI18n.t) || ((k) => k);
  return BUILDERS[id](tt);
}

Object.assign(window, {
  galleryTemplates: { seedDocFor, builders: BUILDERS },
});
