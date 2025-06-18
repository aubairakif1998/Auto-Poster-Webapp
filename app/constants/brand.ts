export const BRAND = {
  name: "Social Auto Poster AI",
  description: "AI-powered social media automation",
} as const;

export const COLORS = {
  primary: {
    from: "#2563eb", // blue-600
    to: "#9333ea", // purple-600
    hover: {
      from: "#1d4ed8", // blue-700
      to: "#7e22ce", // purple-700
    },
  },
  secondary: {
    light: "#f8fafc", // slate-50
    dark: "#e2e8f0", // slate-200
  },
  accent: {
    blue: {
      light: "#dbeafe", // blue-100
      medium: "#93c5fd", // blue-300
      dark: "#1d4ed8", // blue-700
    },
    purple: {
      light: "#f3e8ff", // purple-100
      medium: "#c4b5fd", // purple-300
      dark: "#7e22ce", // purple-700
    },
  },
  success: {
    light: "#dcfce7", // green-100
    dark: "#16a34a", // green-600
  },
  text: {
    primary: "#1e293b", // slate-800
    secondary: "#64748b", // slate-500
    light: "#94a3b8", // slate-400
  },
} as const;

export const GRADIENTS = {
  background: "from-slate-50 to-blue-50",
  primary: "from-blue-600 to-purple-600",
  primaryHover: "from-blue-700 to-purple-700",
} as const;

export const SHADOWS = {
  card: "shadow-2xl",
} as const;

export const SIZES = {
  container: {
    maxWidth: "max-w-md",
  },
} as const;
