import React from 'react';

export const CompanyLogos = () => {
  const logoItems = [
    // 1. Google
    <div key="google" className="flex items-center space-x-1.5 transition-transform hover:scale-[1.04] duration-200 select-none cursor-default shrink-0">
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
      </svg>
      <span className="font-extrabold text-[17px] text-[#5F6368] dark:text-zinc-300 font-sans tracking-tight">Google</span>
    </div>,

    // 2. Microsoft
    <div key="microsoft" className="flex items-center space-x-2 transition-transform hover:scale-[1.04] duration-200 select-none cursor-default shrink-0">
      <svg className="w-[17px] h-[17px] flex-shrink-0" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="10" height="10" fill="#F25022" />
        <rect x="11" y="0" width="10" height="10" fill="#7FBA00" />
        <rect x="0" y="11" width="10" height="10" fill="#00A4EF" />
        <rect x="11" y="11" width="10" height="10" fill="#FFB900" />
      </svg>
      <span className="font-semibold text-[17px] text-[#737373] dark:text-zinc-300 font-sans tracking-tight">Microsoft</span>
    </div>,

    // 3. Amazon
    <div key="amazon" className="flex items-center transition-transform hover:scale-[1.04] duration-200 select-none cursor-default shrink-0">
      <svg className="w-[76px] h-9 flex-shrink-0 text-[#221f1f] dark:text-zinc-200" viewBox="0 0 120 60" fill="none" fillRule="evenodd" xmlns="http://www.w3.org/2000/svg">
        <path d="M72.038 40.703c-5.8 4.283-14.234 6.57-21.486 6.57-10.168 0-19.323-3.76-26.248-10.016-.544-.492-.057-1.162.596-.78 7.474 4.35 16.715 6.965 26.26 6.965 6.438 0 13.52-1.332 20.032-4.096.984-.418 1.806.644.844 1.358m2.418-2.764c-.74-.95-4.9-.448-6.782-.226-.57.07-.657-.427-.144-.784 3.32-2.338 8.77-1.663 9.407-.88s-.165 6.25-3.286 8.858c-.48.4-.936.187-.723-.344.7-1.75 2.272-5.672 1.528-6.625" fill="#FF9900"/>
        <path d="M67.803 20.427v-2.272a.56.56 0 0 1 .575-.575H78.55c.326 0 .588.235.588.575V20.1c-.004.326-.28.753-.766 1.428l-5.27 7.526c1.96-.048 4.026.244 5.802 1.245.4.226.5.557.54.884v2.425c0 .33-.366.718-.75.518-3.13-1.64-7.287-1.82-10.747.017-.353.192-.723-.192-.723-.522v-2.303c0-.37.004-1 .374-1.563l6.107-8.758H68.4c-.326 0-.588-.23-.588-.57M30.694 34.605H27.6c-.296-.022-.53-.244-.553-.527V18.194c0-.318.266-.57.596-.57h2.886c.3.013.54.244.562.53v2.076h.057c.753-2.007 2.168-2.943 4.074-2.943 1.937 0 3.147.936 4.018 2.943.75-2.007 2.45-2.943 4.275-2.943 1.297 0 2.716.535 3.582 1.737.98 1.336.78 3.278.78 4.98L47.87 34.03c0 .318-.266.575-.596.575h-3.1c-.3-.022-.557-.27-.557-.575V25.6c0-.67.06-2.342-.087-2.977-.23-1.066-.923-1.367-1.82-1.367-.75 0-1.532.5-1.85 1.302s-.287 2.142-.287 3.043v8.42c0 .318-.266.575-.596.575h-3.1c-.313-.022-.557-.27-.557-.575l-.004-8.42c0-1.772.292-4.38-1.907-4.38-2.224 0-2.137 2.542-2.137 4.38v8.42c0 .318-.266.575-.596.575M87.896 17.3c4.592 0 7.078 3.944 7.078 8.958 0 4.845-2.747 8.688-7.078 8.688-4.5 0-6.965-3.944-6.965-8.858 0-4.945 2.486-8.8 6.965-8.8m.026 3.243c-2.28 0-2.425 3.108-2.425 5.045s-.03 6.085 2.398 6.085c2.398 0 2.512-3.343 2.512-5.38 0-1.34-.057-2.943-.46-4.214-.348-1.106-1.04-1.537-2.024-1.537m13.007 14.075h-3.082c-.3-.022-.557-.27-.557-.575l-.004-15.888c.026-.292.283-.518.596-.518h2.87c.27.013.492.196.553.444v2.43h.057c.866-2.172 2.08-3.208 4.218-3.208 1.4 0 2.742.5 3.613 1.872.8 1.27.8 3.408.8 4.945v10c-.035.28-.292.5-.596.5H106.3c-.283-.022-.518-.23-.548-.5V25.48c0-1.737.2-4.28-1.937-4.28-.753 0-1.445.505-1.8 1.27-.435.97-.492 1.937-.492 3.008v8.554c-.004.318-.274.575-.605.575m-41.225-7.6c0 1.206.03 2.2-.58 3.282-.492.87-1.275 1.406-2.142 1.406-1.188 0-1.885-.905-1.885-2.242 0-2.638 2.364-3.117 4.605-3.117v.67m3.12 7.544c-.205.183-.5.196-.73.074-1.027-.853-1.214-1.25-1.776-2.063-1.698 1.732-2.903 2.25-5.102 2.25-2.607 0-4.632-1.606-4.632-4.823 0-2.512 1.358-4.222 3.3-5.058 1.68-.74 4.026-.87 5.82-1.075v-.4c0-.736.057-1.606-.38-2.242-.374-.57-1.097-.805-1.737-.805-1.18 0-2.23.605-2.486 1.86-.052.28-.257.553-.54.566l-3-.322c-.252-.057-.535-.26-.46-.65.688-3.64 3.98-4.736 6.92-4.736 1.506 0 3.474.4 4.662 1.54 1.506 1.406 1.362 3.282 1.362 5.324v4.823c0 1.45.6 2.085 1.167 2.87.196.28.24.614-.013.823L62.82 34.57l-.004-.01M19.12 27.017c0 1.206.03 2.2-.58 3.282-.492.87-1.27 1.406-2.142 1.406-1.188 0-1.88-.905-1.88-2.242 0-2.638 2.364-3.117 4.6-3.117v.67m3.12 7.544c-.205.183-.5.196-.73.074-1.027-.853-1.2-1.25-1.776-2.063-1.698 1.732-2.9 2.25-5.102 2.25C12.028 34.822 10 33.216 10 30c0-2.512 1.362-4.222 3.3-5.058 1.68-.74 4.026-.87 5.82-1.075v-.4c0-.736.057-1.606-.374-2.242-.38-.57-1.1-.805-1.737-.805-1.18 0-2.233.605-2.5 1.86-.052.28-.257.553-.535.566l-3.004-.322c-.252-.057-.53-.26-.46-.65.692-3.64 3.98-4.736 6.92-4.736 1.506 0 3.474.4 4.662 1.54 1.506 1.406 1.362 3.282 1.362 5.324v4.823c0 1.45.6 2.085 1.167 2.87.2.28.244.614-.01.823l-2.36 2.052-.01-.01" fill="currentColor"/>
      </svg>
    </div>,

    // 4. Meta
    <div key="meta" className="flex items-center space-x-1.5 transition-transform hover:scale-[1.04] duration-200 select-none cursor-default shrink-0">
      <svg className="w-5 h-5 flex-shrink-0 fill-current text-[#0064E0]" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M8.217 5.243C9.145 3.988 10.171 3 11.483 3 13.96 3 16 6.153 16.001 9.907c0 2.29-.986 3.725-2.757 3.725-1.543 0-2.395-.866-3.924-3.424l-.667-1.123-.118-.197a55 55 0 0 0-.53-.877l-1.178 2.08c-1.673 2.925-2.615 3.541-3.923 3.541C1.086 13.632 0 12.217 0 9.973 0 6.388 1.995 3 4.598 3q.477-.001.924.122c.31.086.611.22.913.407.577.359 1.154.915 1.782 1.714m1.516 2.224q-.378-.615-.727-1.133L9 6.326c.845-1.305 1.543-1.954 2.372-1.954 1.723 0 3.102 2.537 3.102 5.653 0 1.188-.39 1.877-1.195 1.877-.773 0-1.142-.51-2.61-2.87zM4.846 4.756c.725.1 1.385.634 2.34 2.001A212 212 0 0 0 5.551 9.3c-1.357 2.126-1.826 2.603-2.581 2.603-.777 0-1.24-.682-1.24-1.9 0-2.602 1.298-5.264 2.846-5.264q.137 0 .27.018" />
      </svg>
      <span className="font-extrabold text-[18px] text-[#1C2B33] dark:text-zinc-200 font-sans tracking-tight">Meta</span>
    </div>,

    // 5. Netflix
    <div key="netflix" className="flex items-center transition-transform hover:scale-[1.04] duration-200 select-none cursor-default shrink-0">
      <svg className="w-[88px] h-9 flex-shrink-0" viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.14 41.97c-1.53.27-3.086.35-4.696.564l-4.91-14.385V43.15l-4.374.6V16.26h4.08l5.582 15.593V16.26h4.32zm8.454-15.646l5.743-.08v4.294l-5.743.08v6.387l7.595-.456v4.133l-11.89.94V16.26h11.89v4.294h-7.595zm23.563-5.77H50.7v19.752l-4.294.054V20.553h-4.455V16.26h13.204zm6.978 5.475h5.877v4.294h-5.877v9.742H57.92V16.26h11.997v4.294h-7.783zm14.76 10.278l7.3.376v4.24L72.6 40.36v-24.1h4.294zm10.923 4.91l4.213.322V16.26h-4.213zm23.026-24.958l-5.448 13.07 5.448 14.41-4.83-.778-3.086-7.944-3.14 7.3-4.616-.564 5.528-12.587-4.992-12.91h4.616l2.818 7.22 3.006-7.22z" fill="#E50914"/>
      </svg>
    </div>,

    // 6. Adobe
    <div key="adobe" className="flex items-center space-x-1.5 transition-transform hover:scale-[1.04] duration-200 select-none cursor-default shrink-0">
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" fill="#FF0000" rx="3" />
        <path d="M12 5 L18.5 19 H15 L12 11.5 L9 19 H5.5 Z" fill="#FFFFFF" />
      </svg>
      <span className="font-bold text-[17px] text-black dark:text-zinc-200 font-sans tracking-tight">Adobe</span>
    </div>,

    // 7. Stripe
    <div key="stripe" className="flex items-center transition-transform hover:scale-[1.04] duration-200 select-none cursor-default shrink-0">
      <svg className="w-20 h-10 flex-shrink-0 text-[#635BFF]" viewBox="0 0 120 60" fill="none" fillRule="evenodd" xmlns="http://www.w3.org/2000/svg">
        <path d="M101.547 30.94c0-5.885-2.85-10.53-8.3-10.53-5.47 0-8.782 4.644-8.782 10.483 0 6.92 3.908 10.414 9.517 10.414 2.736 0 4.805-.62 6.368-1.494v-4.598c-1.563.782-3.356 1.264-5.632 1.264-2.23 0-4.207-.782-4.46-3.494h11.24c0-.3.046-1.494.046-2.046zM90.2 28.757c0-2.598 1.586-3.678 3.035-3.678 1.402 0 2.897 1.08 2.897 3.678zm-14.597-8.345c-2.253 0-3.7 1.057-4.506 1.793l-.3-1.425H65.73v26.805l5.747-1.218.023-6.506c.828.598 2.046 1.448 4.07 1.448 4.115 0 7.862-3.3 7.862-10.598-.023-6.667-3.816-10.3-7.84-10.3zm-1.38 15.84c-1.356 0-2.16-.483-2.713-1.08l-.023-8.53c.598-.667 1.425-1.126 2.736-1.126 2.092 0 3.54 2.345 3.54 5.356 0 3.08-1.425 5.38-3.54 5.38zm-16.4-17.196l5.77-1.24V13.15l-5.77 1.218zm0 1.747h5.77v20.115h-5.77zm-6.185 1.7l-.368-1.7h-4.966V40.92h5.747V27.286c1.356-1.77 3.655-1.448 4.368-1.195v-5.287c-.736-.276-3.425-.782-4.782 1.7zm-11.494-6.7L34.535 17l-.023 18.414c0 3.402 2.552 5.908 5.954 5.908 1.885 0 3.264-.345 4.023-.76v-4.667c-.736.3-4.368 1.356-4.368-2.046V25.7h4.368v-4.897h-4.37zm-15.54 10.828c0-.897.736-1.24 1.954-1.24a12.85 12.85 0 0 1 5.7 1.47V21.47c-1.908-.76-3.793-1.057-5.7-1.057-4.667 0-7.77 2.437-7.77 6.506 0 6.345 8.736 5.333 8.736 8.07 0 1.057-.92 1.402-2.207 1.402-1.908 0-4.345-.782-6.276-1.84v5.47c2.138.92 4.3 1.3 6.276 1.3 4.782 0 8.07-2.368 8.07-6.483-.023-6.85-8.782-5.632-8.782-8.207z" fill="currentColor"/>
      </svg>
    </div>,

    // 8. Airbnb
    <div key="airbnb" className="flex items-center space-x-1.5 transition-transform hover:scale-[1.04] duration-200 select-none cursor-default shrink-0">
      <svg className="w-[18px] h-[18px] flex-shrink-0 fill-none stroke-[#FF5A5F]" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.25c-4.08 0-7.39 3.31-7.39 7.39 0 2.5 1.25 4.8 3.25 6.26l4.14 5.86 4.14-5.86c2-1.46 3.25-3.76 3.25-6.26 0-4.08-3.31-7.39-7.39-7.39z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
      <span className="font-bold text-[18px] text-[#FF5A5F] font-sans tracking-tight">airbnb</span>
    </div>
  ];

  return (
    <div className="w-full py-4 space-y-4">
      {/* Centered Heading */}
      <div className="text-center">
        <h2 className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.25em] text-[#475569] dark:text-[#94a3b8]">
          Trusted by Industry Leaders
        </h2>
      </div>

      {/* Top thin horizontal divider */}
      <div className="w-full border-t border-slate-200/60 dark:border-zinc-800/60" />

      {/* Marquee horizontal container with fade gradients */}
      <div 
        className="w-full overflow-hidden relative py-2"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
        }}
      >
        {/* Scrolling Track */}
        <div className="animate-marquee items-center flex gap-x-12 hover:[animation-play-state:paused]">
          
          {/* List 1 */}
          <div className="flex items-center gap-x-12 pr-12 shrink-0">
            {logoItems}
          </div>

          {/* List 2 (duplication for seamless animation) */}
          <div className="flex items-center gap-x-12 pr-12 shrink-0" aria-hidden="true">
            {logoItems}
          </div>

        </div>
      </div>

      {/* Bottom thin horizontal divider */}
      <div className="w-full border-t border-slate-200/60 dark:border-zinc-800/60" />
    </div>
  );
};
