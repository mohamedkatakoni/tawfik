// src/app/twitter-image.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "توفيق | دروس واختبارات وفروض لجميع المراحل في الجزائر";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #F7F3EC 0%, #EDE9FE 50%, #F7F3EC 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "400px", height: "400px", borderRadius: "50%",
          background: "rgba(124,58,237,0.08)", display: "flex",
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-60px",
          width: "300px", height: "300px", borderRadius: "50%",
          background: "rgba(124,58,237,0.06)", display: "flex",
        }} />
        <div style={{
          background: "#7C3AED", borderRadius: "24px",
          padding: "16px 48px", marginBottom: "32px", display: "flex",
        }}>
          <span style={{ fontSize: "52px", color: "#fff", fontWeight: 900 }}>توفيق.</span>
        </div>
        <div style={{
          fontSize: "52px", fontWeight: 800, color: "#1A1A1A",
          textAlign: "center", lineHeight: 1.3, marginBottom: "24px",
          maxWidth: "900px", display: "flex",
        }}>
          دروس واختبارات وفروض محلولة
        </div>
        <div style={{
          fontSize: "30px", color: "#6B7280",
          textAlign: "center", marginBottom: "48px", display: "flex",
        }}>
          لجميع المراحل الدراسية في الجزائر — مجاناً
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          {["ابتدائي", "متوسط", "ثانوي", "BAC", "BEM"].map((tag) => (
            <div key={tag} style={{
              background: "#fff", border: "2px solid #E8E2D8",
              borderRadius: "100px", padding: "10px 28px",
              fontSize: "24px", color: "#7C3AED", fontWeight: 700,
              display: "flex",
            }}>
              {tag}
            </div>
          ))}
        </div>
        <div style={{
          position: "absolute", bottom: "32px", right: "48px",
          fontSize: "22px", color: "#AAA", display: "flex",
        }}>
          tawfikdz.online
        </div>
      </div>
    ),
    { ...size }
  );
}