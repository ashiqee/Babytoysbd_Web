"use client"
import { Share } from 'lucide-react';
import { useState, useEffect } from 'react';


// Social Media Icons Components
function FacebookIcon(props:any) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function XIcon(props:any) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function LinkedInIcon(props:any) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function EmailIcon(props:any) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  );
}

function WhatsAppIcon(props:any) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

function TikTokIcon(props:any) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );
}

// ShareButton Component
export default function ShareButton(product:any) {
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event:any) => {
      if (isShareDropdownOpen && !event.target.closest('.share-dropdown')) {
        setIsShareDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShareDropdownOpen]);

  // Share functions
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareOnX = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.productName)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareOnEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(product.productName)}&body=${encodeURIComponent(window.location.href)}`;
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(product.productName + ' ' + window.location.href)}`, '_blank');
  };

  const shareOnTikTok = () => {
    // TikTok doesn't have a direct share URL like other platforms
    // We'll copy the link to clipboard and show a message
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied! You can now paste it in your TikTok video description or caption.');
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.productName,
        text: product.sortDescription,
        url: window.location.href,
      })
      .catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="relative share-dropdown">
      <button 
        onClick={() => setIsShareDropdownOpen(!isShareDropdownOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
        title="Share product"
      >
        <Share className="h-4 w-4" />
      </button>
      
      {isShareDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white/45 backdrop-blur-sm rounded-md shadow-lg py-2 px-4 z-10 flex flex-wrap justify-center gap-3 md:w-fit w-72">
          <div className="flex flex-wrap md:flex-nowrap justify-center p-4 gap-3">
            <button 
              onClick={shareOnFacebook} 
              className="flex flex-col items-center justify-center w-14 h-14 bg-white rounded-full p-1 shadow hover:shadow-md transition-all" 
              title="Share on Facebook"
            >
              <FacebookIcon className="h-6 w-6 text-blue-500" />
              <span className="text-xs mt-1">Facebook</span>
            </button>
            <button 
              onClick={shareOnX} 
              className="flex flex-col items-center justify-center w-14 h-14 bg-white rounded-full p-1 shadow hover:shadow-md transition-all" 
              title="Share on X"
            >
              <XIcon className="h-6 w-6 text-black" />
              <span className="text-xs mt-1">X</span>
            </button>
            <button 
              onClick={shareOnLinkedIn} 
              className="flex flex-col items-center justify-center w-14 h-14 bg-white rounded-full p-1 shadow hover:shadow-md transition-all" 
              title="Share on LinkedIn"
            >
              <LinkedInIcon className="h-6 w-6 text-blue-700" />
              <span className="text-xs mt-1">LinkedIn</span>
            </button>
            <button 
              onClick={shareOnEmail} 
              className="flex flex-col items-center justify-center w-14 h-14 bg-white rounded-full p-1 shadow hover:shadow-md transition-all" 
              title="Share via Email"
            >
              <EmailIcon className="h-6 w-6 text-gray-600" />
              <span className="text-xs mt-1">Email</span>
            </button>
            <button 
              onClick={shareOnWhatsApp} 
              className="flex flex-col items-center justify-center w-14 h-14 bg-white rounded-full p-1 shadow hover:shadow-md transition-all" 
              title="Share on WhatsApp"
            >
              <WhatsAppIcon className="h-6 w-6 text-green-500" />
              <span className="text-xs mt-1">WhatsApp</span>
            </button>
            <button 
              onClick={shareOnTikTok} 
              className="flex flex-col items-center justify-center w-14 h-14 bg-white rounded-full p-1 shadow hover:shadow-md transition-all" 
              title="Share on TikTok"
            >
              <TikTokIcon className="h-6 w-6 text-black" />
              <span className="text-xs mt-1">TikTok</span>
            </button>
            <button 
              onClick={handleNativeShare} 
              className="flex flex-col items-center justify-center w-14 h-14 bg-white rounded-full p-1 shadow hover:shadow-md transition-all" 
              title="More share options"
            >
              <Share className="h-6 w-6 text-gray-700" />
              <span className="text-xs mt-1">More</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}