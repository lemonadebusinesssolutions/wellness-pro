import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 80) {
    return { label: "Excellent", color: "green" };
  } else if (score >= 70) {
    return { label: "Good", color: "green" };
  } else if (score >= 50) {
    return { label: "Moderate", color: "amber" };
  } else if (score >= 30) {
    return { label: "Needs Attention", color: "red" };
  } else {
    return { label: "Critical", color: "red" };
  }
}

export function getCategoryScoreLabel(score: number): { label: string; color: string } {
  if (score >= 80) {
    return { label: "Low", color: "green" };
  } else if (score >= 60) {
    return { label: "Moderate", color: "amber" };
  } else {
    return { label: "High", color: "red" };
  }
}

export function getRecommendationPriorityLabel(priority: string): { label: string; color: string } {
  switch (priority.toLowerCase()) {
    case "high":
      return { label: "High Priority", color: "red" };
    case "medium":
      return { label: "Medium Priority", color: "amber" };
    case "low":
      return { label: "Maintenance", color: "green" };
    default:
      return { label: priority, color: "gray" };
  }
}

export function getAssessmentColor(type: string): {
  textColor: string;
  bgColor: string;
  hoverBgColor: string;
  iconBgColor: string;
} {
  // Map assessment types to color schemes
  const colorMap: Record<string, {
    textColor: string;
    bgColor: string;
    hoverBgColor: string;
    iconBgColor: string;
  }> = {
    // Original colors
    stress: {
      textColor: "text-blue-600",
      bgColor: "bg-blue-600",
      hoverBgColor: "hover:bg-blue-700",
      iconBgColor: "bg-blue-100",
    },
    workplace: {
      textColor: "text-purple-600",
      bgColor: "bg-purple-600",
      hoverBgColor: "hover:bg-purple-700",
      iconBgColor: "bg-purple-100",
    },
    digital: {
      textColor: "text-cyan-600",
      bgColor: "bg-cyan-600",
      hoverBgColor: "hover:bg-cyan-700",
      iconBgColor: "bg-cyan-100",
    },
    
    // New assessment types
    happiness: {
      textColor: "text-yellow-600",
      bgColor: "bg-yellow-600",
      hoverBgColor: "hover:bg-yellow-700",
      iconBgColor: "bg-yellow-100",
    },
    physical_wellbeing: {
      textColor: "text-green-600",
      bgColor: "bg-green-600",
      hoverBgColor: "hover:bg-green-700",
      iconBgColor: "bg-green-100",
    },
    emotional_wellbeing: {
      textColor: "text-pink-600",
      bgColor: "bg-pink-600",
      hoverBgColor: "hover:bg-pink-700",
      iconBgColor: "bg-pink-100",
    },
    social_connection: {
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-600",
      hoverBgColor: "hover:bg-indigo-700",
      iconBgColor: "bg-indigo-100",
    },
    sleep_quality: {
      textColor: "text-blue-600",
      bgColor: "bg-blue-600",
      hoverBgColor: "hover:bg-blue-700",
      iconBgColor: "bg-blue-100",
    },
    mindfulness: {
      textColor: "text-teal-600",
      bgColor: "bg-teal-600",
      hoverBgColor: "hover:bg-teal-700",
      iconBgColor: "bg-teal-100",
    },
    self_compassion: {
      textColor: "text-rose-600",
      bgColor: "bg-rose-600",
      hoverBgColor: "hover:bg-rose-700",
      iconBgColor: "bg-rose-100",
    },
    financial_wellbeing: {
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-600",
      hoverBgColor: "hover:bg-emerald-700",
      iconBgColor: "bg-emerald-100",
    },
    life_purpose: {
      textColor: "text-amber-600",
      bgColor: "bg-amber-600",
      hoverBgColor: "hover:bg-amber-700",
      iconBgColor: "bg-amber-100",
    },
    resilience: {
      textColor: "text-orange-600",
      bgColor: "bg-orange-600",
      hoverBgColor: "hover:bg-orange-700",
      iconBgColor: "bg-orange-100",
    },
    nutrition: {
      textColor: "text-lime-600",
      bgColor: "bg-lime-600",
      hoverBgColor: "hover:bg-lime-700",
      iconBgColor: "bg-lime-100",
    },
    physical_activity: {
      textColor: "text-sky-600",
      bgColor: "bg-sky-600",
      hoverBgColor: "hover:bg-sky-700",
      iconBgColor: "bg-sky-100",
    },
  };

  return colorMap[type] || {
    textColor: "text-indigo-600",
    bgColor: "bg-indigo-600",
    hoverBgColor: "hover:bg-indigo-700",
    iconBgColor: "bg-indigo-100",
  };
}

// Create an anonymous user ID if none exists
export function getAnonymousUserId(): number {
  const storedId = localStorage.getItem("anonymousUserId");
  if (storedId) {
    return parseInt(storedId);
  }
  
  // Generate a random ID between 1000-9999
  const newId = Math.floor(Math.random() * 9000) + 1000;
  localStorage.setItem("anonymousUserId", newId.toString());
  return newId;
}
