import { useState, useEffect } from "react";

export interface ORModel {
  id: string;
  name: string;
  pricing: { prompt: string; completion: string };
  context_length: number;
  description?: string;
}

export function useOpenRouterModels() {
  const [data, setData] = useState<ORModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const cached = sessionStorage.getItem("or-models");
    if (cached) {
      try {
        const { models, ts } = JSON.parse(cached);
        setData(models);
        setLastUpdated(new Date(ts));
        setLoading(false);
        return;
      } catch {/* ignore */}
    }
    fetch("https://openrouter.ai/api/v1/models")
      .then((r) => r.json())
      .then((json) => {
        const models = (json.data || []).slice(0, 30);
        sessionStorage.setItem("or-models", JSON.stringify({ models, ts: Date.now() }));
        setData(models);
        setLastUpdated(new Date());
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, lastUpdated };
}
