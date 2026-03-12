import type { CompanyInfo } from "../types/CompanyInfo.ts" 

export async function sendCompanyData(payload: CompanyInfo) {
  const response = await fetch("/api/company-info/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to send POST");
  }

  return response.json();
}