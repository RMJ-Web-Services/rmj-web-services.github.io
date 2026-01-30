use wasm_bindgen::prelude::*;
use qrcode::QrCode;
use qrcode::render::svg;

// Expose a function to JS
#[wasm_bindgen]
pub fn create_qr(iban: &str, amount: &str, msg: &str) -> String {
    // Build the QR Platba string
    let payload = format!("SPD*1.0*ACC:{}*AM:{}*CC:CZK*MSG:{}*", iban, amount, msg);

    // Generate the QR code as SVG
    let code = QrCode::new(payload).unwrap();
    let svg = code.render::<svg::Color>().build();
    
    // Return SVG as string (can be embedded in <div> in JS)
    svg
}