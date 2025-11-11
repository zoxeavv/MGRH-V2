const avatarPaths = {
  user1: "/images/profile/user-1.jpg",
  user2: "/images/profile/user-2.jpg",
  user3: "/images/profile/user-3.jpg",
  user4: "/images/profile/user-4.jpg",
} as const;

const iconPaths = {
  account: "/images/svgs/icon-account.svg",
  inbox: "/images/svgs/icon-inbox.svg",
  tasks: "/images/svgs/icon-tasks.svg",
} as const;

const dropdownIcons = {
  chat: "/images/svgs/icon-dd-chat.svg",
  cart: "/images/svgs/icon-dd-cart.svg",
  invoice: "/images/svgs/icon-dd-invoice.svg",
  date: "/images/svgs/icon-dd-date.svg",
  mobile: "/images/svgs/icon-dd-mobile.svg",
  lifebuoy: "/images/svgs/icon-dd-lifebuoy.svg",
  message: "/images/svgs/icon-dd-message-box.svg",
  application: "/images/svgs/icon-dd-application.svg",
} as const;

const notifications = [
  {
    avatar: avatarPaths.user1,
    title: "Roman Joined the Team!",
    subtitle: "Congratulate him",
  },
  {
    avatar: avatarPaths.user2,
    title: "New message received",
    subtitle: "Salma sent you new message",
  },
  {
    avatar: avatarPaths.user3,
    title: "New Payment received",
    subtitle: "Check your earnings",
  },
  {
    avatar: avatarPaths.user4,
    title: "Jolly completed tasks",
    subtitle: "Assign her new tasks",
  },
  {
    avatar: avatarPaths.user1,
    title: "Roman Joined the Team!",
    subtitle: "Congratulate him",
  },
  {
    avatar: avatarPaths.user2,
    title: "New message received",
    subtitle: "Salma sent you new message",
  },
  {
    avatar: avatarPaths.user3,
    title: "New Payment received",
    subtitle: "Check your earnings",
  },
  {
    avatar: avatarPaths.user4,
    title: "Jolly completed tasks",
    subtitle: "Assign her new tasks",
  },
];

const profile = [
  {
    href: "/user-profile",
    title: "My Profile",
    subtitle: "Account Settings",
    icon: iconPaths.account,
  },
  {
    href: "/apps/email",
    title: "My Inbox",
    subtitle: "Messages & Emails",
    icon: iconPaths.inbox,
  },
  {
    href: "/apps/notes",
    title: "My Tasks",
    subtitle: "To-do and Daily Tasks",
    icon: iconPaths.tasks,
  },
];

const appsLink = [
  {
    href: "/apps/chats",
    title: "Chat Application",
    subtext: "Messages & Emails",
    avatar: dropdownIcons.chat,
  },
  {
    href: "/apps/ecommerce/shop",
    title: "eCommerce App",
    subtext: "Messages & Emails",
    avatar: dropdownIcons.cart,
  },
  {
    href: "/",
    title: "Invoice App",
    subtext: "Messages & Emails",
    avatar: dropdownIcons.invoice,
  },
  {
    href: "/apps/calendar",
    title: "Calendar App",
    subtext: "Messages & Emails",
    avatar: dropdownIcons.date,
  },
  {
    href: "/apps/contacts",
    title: "Contact Application",
    subtext: "Account settings",
    avatar: dropdownIcons.mobile,
  },
  {
    href: "/apps/tickets",
    title: "Tickets App",
    subtext: "Account settings",
    avatar: dropdownIcons.lifebuoy,
  },
  {
    href: "/apps/email",
    title: "Email App",
    subtext: "To-do and Daily tasks",
    avatar: dropdownIcons.message,
  },
  {
    href: "/",
    title: "Kanban Application",
    subtext: "To-do and Daily tasks",
    avatar: dropdownIcons.application,
  },
];

const pageLinks = [
  {
    href: "/pricing",
    title: "Pricing Page",
  },
  {
    href: "/auth/login",
    title: "Authentication Design",
  },
  {
    href: "/auth/register",
    title: "Register Now",
  },
  {
    href: "/404",
    title: "404 Error Page",
  },
  {
    href: "/apps/notes",
    title: "Notes App",
  },
  {
    href: "/user-profile",
    title: "User Application",
  },
  {
    href: "/apps/blog/posts",
    title: "Blog Design",
  },
  {
    href: "/apps/ecommerce/eco-checkout",
    title: "Shopping Cart",
  },
];

export { notifications, profile, pageLinks, appsLink };

