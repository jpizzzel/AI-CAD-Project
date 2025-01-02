import React from 'react';

const NavigationMenu = () => {
  return (
    <div className="flex justify-around gap-4 items-center px-4 py-1 bg-black rounded-[15px] ring-1 ring-white">
      <div
        className="relative group hover:cursor-pointer hover:bg-slate-800 p-2 rounded-full transition-all duration-500"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M27.9167 30H20.4167C19.2658 30 18.3333 29.1392 18.3333 28.0769V21.1538C18.3333 20.3038 17.5875 19.6154 16.6667 19.6154H13.3333C12.4125 19.6154 11.6667 20.3038 11.6667 21.1538V28.0769C11.6667 29.1392 10.7342 30 9.58333 30H2.08333C0.9325 30 0 29.1392 0 28.0769V13.3946C0 11.6262 0.878334 9.95539 2.3825 8.86154L14.2258 0.246923C14.68 -0.0823077 15.32 -0.0823077 15.7733 0.246923L27.6183 8.86154C29.1225 9.95539 30 11.6254 30 13.3931V28.0769C30 29.1392 29.0675 30 27.9167 30Z"
            fill="white"
          ></path>
        </svg>
        <div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-max px-2 py-1 text-white bg-black rounded-md opacity-0 scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100"
        >
          Home
        </div>
      </div>

      <div
        className="relative group hover:cursor-pointer hover:bg-slate-800 p-2 rounded-full transition-all duration-500"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.0013 0C10.482 0 6.81914 3.50348 6.81914 7.82609V9.13044C6.81914 13.453 10.482 16.9565 15.0013 16.9565C19.5206 16.9565 23.1835 13.453 23.1835 9.13044V7.82609C23.1835 3.50348 19.5206 0 15.0013 0ZM14.9987 20.8696C9.53569 20.8696 2.52628 23.6959 0.509366 26.2041C-0.737054 27.755 0.44947 30 2.49366 30H27.5063C29.5505 30 30.7371 27.755 29.4906 26.2041C27.4737 23.6972 20.4616 20.8696 14.9987 20.8696Z"
            fill="white"
          ></path>
        </svg>
        <div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-max px-2 py-1 text-white bg-black rounded-md opacity-0 scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100"
        >
          About
        </div>
      </div>

      <div
        className="relative group hover:cursor-pointer hover:bg-slate-800 p-2 rounded-full transition-all duration-500"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.6923 0C10.1547 0 8.07692 2.16563 8.07692 4.8V6H10.3846V4.8C10.3846 3.45938 11.4032 2.4 12.6923 2.4H17.3077C18.5968 2.4 19.6154 3.45938 19.6154 4.8V6H21.9231V4.8C21.9231 2.16563 19.8453 0 17.3077 0H12.6923ZM5.625 7.2C2.51953 7.2 0 9.82031 0 13.05V24.15C0 27.3797 2.51953 30 5.625 30H24.375C27.4805 30 30 27.3797 30 24.15V13.05C30 9.82031 27.4805 7.2 24.375 7.2H5.625ZM15 15.4875C16.3386 15.4875 17.4159 16.6078 17.4159 18C17.4159 19.3922 16.3386 20.5125 15 20.5125C13.6614 20.5125 12.5841 19.3922 12.5841 18C12.5841 16.6078 13.6614 15.4875 15 15.4875Z"
            fill="white"
          ></path>
        </svg>
        <div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-max px-2 py-1 text-white bg-black rounded-md opacity-0 scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100"
        >
          Portfolio
        </div>
      </div>

      <div
        className="relative group hover:cursor-pointer hover:bg-slate-800 p-2 rounded-full transition-all duration-500"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.4672 19.4199C21.9377 19.1095 21.2868 19.116 20.7598 19.4291L18.0912 21.0191C17.4938 21.3751 16.7477 21.3334 16.1999 20.9056C15.2529 20.166 13.7282 18.9217 12.4016 17.5952C11.0751 16.2687 9.8308 14.7439 9.09124 13.7969C8.66342 13.2491 8.62168 12.503 8.97776 11.9057L10.5677 9.23697C10.8821 8.71002 10.8847 8.05394 10.5743 7.52438L6.65865 0.835732C6.27909 0.188781 5.52518 -0.129478 4.79606 0.0492166C4.0878 0.221389 3.16825 0.641386 2.20434 1.6066C-0.813896 4.62483 -2.41693 9.71567 8.93342 21.066C20.2838 32.4164 25.3733 30.8146 28.3928 27.7951C29.3593 26.8286 29.778 25.9077 29.9515 25.1982C30.1276 24.4703 29.8145 23.7216 29.1689 23.3434C27.5567 22.4004 24.0794 20.3643 22.4672 19.4199Z"
            fill="white"
          ></path>
        </svg>
        <div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-max px-2 py-1 text-white bg-black rounded-md opacity-0 scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100"
        >
          Contact
        </div>
      </div>
    </div>
  );
};

export default NavigationMenu;
