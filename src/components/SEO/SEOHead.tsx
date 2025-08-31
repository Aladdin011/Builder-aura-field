import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const defaultSEO = {
  title: 'JD Marc Limited - Premier Construction & Infrastructure Development in Africa',
  description: 'Leading construction company in Africa providing residential, commercial, and infrastructure development services. 15+ years of excellence building Africa\'s future cities.',
  keywords: 'construction, infrastructure, Africa, Nigeria, residential construction, commercial buildings, smart cities, urban planning, project management',
  image: 'https://cdn.builder.io/api/v1/image/assets%2F751ea84be0da437c8dd3f1bf04173189%2F6fe8dede446d44e5b3f61dac8e245b53?alt=media&token=2cd3aa20-e283-42dd-ad0a-b327725825be&apiKey=751ea84be0da437c8dd3f1bf04173189',
  url: 'https://jdmarcng.com',
  type: 'website' as const,
  author: 'JD Marc Limited',
};

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
}) => {
  const location = useLocation();
  
  const seoData = {
    title: title || defaultSEO.title,
    description: description || defaultSEO.description,
    keywords: keywords || defaultSEO.keywords,
    image: image || defaultSEO.image,
    url: url || `${defaultSEO.url}${location.pathname}`,
    type,
    author: author || defaultSEO.author,
  };

  useEffect(() => {
    // Update document title
    document.title = seoData.title;

    // Create or update meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', seoData.description);
    updateMetaTag('keywords', seoData.keywords);
    updateMetaTag('author', seoData.author);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Open Graph meta tags
    updateMetaTag('og:title', seoData.title, true);
    updateMetaTag('og:description', seoData.description, true);
    updateMetaTag('og:image', seoData.image, true);
    updateMetaTag('og:url', seoData.url, true);
    updateMetaTag('og:type', seoData.type, true);
    updateMetaTag('og:site_name', 'JD Marc Limited', true);
    updateMetaTag('og:locale', 'en_US', true);

    // Twitter Card meta tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', seoData.title);
    updateMetaTag('twitter:description', seoData.description);
    updateMetaTag('twitter:image', seoData.image);
    updateMetaTag('twitter:site', '@jdmarc');
    updateMetaTag('twitter:creator', '@jdmarc');

    // Article specific meta tags
    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime, true);
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, true);
      }
      updateMetaTag('article:author', seoData.author, true);
      updateMetaTag('article:section', 'Construction', true);
      updateMetaTag('article:tag', seoData.keywords, true);
    }

    // Additional SEO meta tags
    updateMetaTag('theme-color', '#AA7452');
    updateMetaTag('msapplication-TileColor', '#AA7452');
    updateMetaTag('application-name', 'JD Marc Limited');
    updateMetaTag('apple-mobile-web-app-title', 'JD Marc');
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');

    // Geo meta tags for local SEO
    updateMetaTag('geo.region', 'NG-FC');
    updateMetaTag('geo.placename', 'Abuja');
    updateMetaTag('geo.position', '9.0579;7.4951');
    updateMetaTag('ICBM', '9.0579, 7.4951');

    // Business/Organization meta tags
    updateMetaTag('business:contact_data:street_address', 'Plot 107, Ahmadu Bello Way');
    updateMetaTag('business:contact_data:locality', 'Abuja');
    updateMetaTag('business:contact_data:region', 'FCT');
    updateMetaTag('business:contact_data:postal_code', '900001');
    updateMetaTag('business:contact_data:country_name', 'Nigeria');
    updateMetaTag('business:contact_data:email', 'info@jdmarcng.com');
    updateMetaTag('business:contact_data:phone_number', '+234-803-706-5497');
    updateMetaTag('business:contact_data:website', 'https://jdmarcng.com');

    // Create canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', seoData.url);

    // Create JSON-LD structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'JD Marc Limited',
      alternateName: 'JD Marc Construction',
      description: seoData.description,
      url: 'https://jdmarcng.com',
      logo: 'https://jdmarcng.com/images/brand/logo.jpg',
      image: seoData.image,
      foundingDate: '2007',
      founder: {
        '@type': 'Person',
        name: 'Jude Onwudebe'
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Plot 107, Ahmadu Bello Way',
        addressLocality: 'Abuja',
        addressRegion: 'FCT',
        postalCode: '900001',
        addressCountry: 'NG'
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+234-803-706-5497',
          contactType: 'customer service',
          email: 'info@jdmarcng.com',
          availableLanguage: ['English'],
          areaServed: 'NG'
        },
        {
          '@type': 'ContactPoint',
          telephone: '+44-7760954844',
          contactType: 'international',
          email: 'info@jdmarc.co.uk',
          availableLanguage: ['English'],
          areaServed: 'GB'
        }
      ],
      sameAs: [
        'https://facebook.com/jdmarc',
        'https://twitter.com/jdmarc',
        'https://linkedin.com/company/jdmarc',
        'https://instagram.com/jdmarc'
      ],
      serviceArea: {
        '@type': 'Place',
        name: 'Africa'
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Construction Services',
        itemListElement: [
          {
            '@type': 'OfferCatalog',
            name: 'Residential Construction',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Home Construction',
                  description: 'Complete residential construction services'
                }
              }
            ]
          },
          {
            '@type': 'OfferCatalog',
            name: 'Commercial Construction',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Office Buildings',
                  description: 'Commercial building construction and development'
                }
              }
            ]
          },
          {
            '@type': 'OfferCatalog',
            name: 'Infrastructure Development',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Infrastructure Projects',
                  description: 'Large-scale infrastructure development projects'
                }
              }
            ]
          }
        ]
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '150',
        bestRating: '5',
        worstRating: '1'
      },
      review: [
        {
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: '5',
            bestRating: '5'
          },
          author: {
            '@type': 'Person',
            name: 'Corporate Client'
          },
          reviewBody: 'Exceptional construction quality and professional project management. JD Marc delivered our commercial complex on time and within budget.'
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

  }, [
    seoData.title,
    seoData.description,
    seoData.keywords,
    seoData.image,
    seoData.url,
    seoData.type,
    seoData.author,
    publishedTime,
    modifiedTime,
  ]);

  return null;
};

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: 'JD Marc Limited - Premier Construction & Infrastructure Development in Africa',
    description: 'Leading construction company in Africa providing residential, commercial, and infrastructure development services. 15+ years of excellence building Africa\'s future cities.',
    keywords: 'construction Africa, Nigeria construction, residential buildings, commercial construction, infrastructure development, smart cities, JD Marc',
  },
  about: {
    title: 'About JD Marc Limited - 15+ Years of Construction Excellence in Africa',
    description: 'Learn about JD Marc Limited\'s journey since 2007, our expert team, global offices, and commitment to building Africa\'s future through innovative construction solutions.',
    keywords: 'about JD Marc, construction company history, African construction experts, construction team, company profile',
  },
  services: {
    title: 'Construction Services - Residential, Commercial & Infrastructure | JD Marc',
    description: 'Comprehensive construction services including residential homes, commercial buildings, infrastructure development, and smart city solutions across Africa.',
    keywords: 'construction services, residential construction, commercial buildings, infrastructure development, smart cities, project management',
  },
  projects: {
    title: 'Construction Projects Portfolio - JD Marc Limited',
    description: 'Explore our portfolio of completed construction projects across Africa including residential, commercial, and infrastructure developments.',
    keywords: 'construction projects, portfolio, completed buildings, African construction, project showcase',
  },
  contact: {
    title: 'Contact JD Marc Limited - Get Your Construction Project Quote',
    description: 'Contact JD Marc Limited for your construction needs. Get professional consultation and quotes for residential, commercial, and infrastructure projects.',
    keywords: 'contact construction company, construction quote, project consultation, construction services inquiry',
  },
};
