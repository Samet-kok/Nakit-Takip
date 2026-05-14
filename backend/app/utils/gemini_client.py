import google.generativeai as genai
from app.config import get_settings
import base64
import io
import json

settings = get_settings()
genai.configure(api_key=settings.GEMINI_API_KEY)

class GeminiClient:
    def __init__(self):
        self.model = genai.GenerativeModel("gemini-1.5-flash-latest")
    
    def extract_invoice_data(self, file_bytes: bytes, mime_type: str) -> dict:
        """
        Fatura görseli/PDF'sinden yapılandırılmış veri çıkarır.
        Returns: {"vendor_name", "amount", "currency", "due_date", "type", "confidence"}
        """
        prompt = """
        Sen bir finansal fatura analiz uzmanısın. Bu fatura görselini veya PDF'sini incele ve aşağıdaki JSON formatında çıktı ver.

        Çıkarmanı gereken alanlar:
        - vendor_name: Faturayı kesen firma veya kişi adı (string)
        - amount: Fatura tutarı, sadece sayısal değer (float)
        - currency: Para birimi (TRY, USD, EUR vb.) (string)
        - due_date: Son ödeme tarihi (YYYY-MM-DD formatında) (string)
        - type: Bu fatura şirkete GELİR mi (tahsilat) yoksa GİDER mi (ödeme)? "income" veya "expense" olarak belirle. (string)
        - confidence: Çıkarım güven skoru 0-1 arası (float)

        Eğer bir alanı çıkaramazsan null döndür.
        Sadece geçerli JSON döndür, başka açıklama yapma.

        Örnek çıktı:
        {
            "vendor_name": "ABC Tedarik Ltd.",
            "amount": 15420.50,
            "currency": "TRY",
            "due_date": "2026-05-30",
            "type": "expense",
            "confidence": 0.95
        }
        """
        
        try:
            # Base64 encode et
            encoded = base64.b64encode(file_bytes).decode("utf-8")
            
            response = self.model.generate_content(
                contents=[
                    {"role": "user", "parts": [
                        {"text": prompt},
                        {"inline_data": {"mime_type": mime_type, "data": encoded}}
                    ]}
                ],
                generation_config={"temperature": 0.1, "max_output_tokens": 1024}
            )
            
            # Gemini'nin yanıtını temizle ve JSON'a çevir
            text = response.text.strip()
            # Markdown code block varsa temizle
            if text.startswith("```json"):
                text = text[7:]
            elif text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()
            
            result = json.loads(text)
            
            # Varsayılan değerler
            return {
                "vendor_name": result.get("vendor_name") or "Bilinmeyen Firma",
                "amount": float(result.get("amount") or 0),
                "currency": result.get("currency") or "TRY",
                "due_date": result.get("due_date"),
                "type": result.get("type") or "expense",
                "confidence": float(result.get("confidence") or 0.5),
                "raw_response": text
            }
            
        except Exception as e:
            return {
                "vendor_name": "Analiz Hatası",
                "amount": 0,
                "currency": "TRY",
                "due_date": None,
                "type": "expense",
                "confidence": 0,
                "error": str(e),
                "raw_response": getattr(response, 'text', 'N/A') if 'response' in dir() else str(e)
            }

gemini_client = GeminiClient()
