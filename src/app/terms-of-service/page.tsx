export default function TermsOfServicePage() {
  return (
    <main className="container-main section-padding">
      <div className="glass-panel rounded-[32px] p-8 md:p-12 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-[13px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2">Accurate Pathalogy Laboratory</p>
          <h1 className="text-3xl md:text-5xl font-black text-[#11243E] mb-8 leading-tight tracking-tight">Terms & Conditions</h1>
          
          <div className="space-y-8 text-[15px] leading-relaxed text-[#52657d] font-medium">
            <section>
              <p className="mb-4">
                Welcome to accuratepathlabs.in - Please read these Terms & Conditions carefully before you access any information and utilize Accurate Pathalogy Laboratory diagnostic services. By agreeing to our Terms of Use, you acknowledge that you accept these terms & conditions and will abide by them. If you do not agree with our terms of use, you should stop accessing the information or using the services.
              </p>
              <p className="mb-4">
                The content available on this website is related to accuratepathlabs.in and is the property of Accurate Pathalogy Labs Pvt Ltd & along with its subsidiaries. accuratepathlabs.in is a leading omnichannel service provider which provides quality and affordable diagnostic services through home sample collection or visit to the nearest lab or collection centre.
              </p>
              <p>
                By using, browsing or in any way transacting on the website, or using any services, you indicate that you agree to be bound by these Terms & conditions mentioned herein.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#11243E] mb-4">1. Eligibility</h2>
              <p className="mb-4">
                By using the Website and/or availing the Services, users represent and warrant that they have the right, authority, and capacity to agree with the Company policies in respect of the Services being offered and to abide by all of the conditions set forth herein.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are responsible for all the transactions you make under your name or account.</li>
                <li>You are 18 years of age or over and have the legal rights to agree with the form of the binding contract in your jurisdiction.</li>
                <li>You signify and warrant to the Company that you will use the services in a manner dependable with all the pertinent rules and regulations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#11243E] mb-4">2. Services and Terms of Use</h2>
              <p className="mb-4">
                Redcliffe Labs holds the right to make changes in the nature of services and offers mentioned in the Health packages. The changes will be notified to the users/ customers on the website. If user require any clarification with regard to information available in his/her booking, it is advised to contact the customer support team to get the resolution.
              </p>
              <p>
                Shipping and delivery of reports: In case of home sample collection, we provide e-reports on the registered mobile number via sms/ WhatsApp and registered email.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#11243E] mb-4">3. Sample collection and Report Generation</h2>
              <p className="mb-4">
                Sample collection is scheduled based on the booking date of tests. Users can also reschedule the sample collection as per the available time and slot.
              </p>
              <p>
                Post sample collection, reports are usually generated within 24-48 hours from the time the sample is sent to the labs for examination, however some tests shall have longer processing times and shall be informed to the user at the time of sample booking / collection. In some cases, there are chances that users may experience delay in test results.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#11243E] mb-4">4. Offers and Coupon Code</h2>
              <p className="mb-4">
                In addition to the T&Cs, coupon redemption is subject to standard and specified terms and conditions mentioned by Accurate Pathalogy Laboratory. Coupons are issued on behalf of respective retailers.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Each claimant/ user is entitled to one coupon per Booking ID.</li>
                <li>Coupons are not transferable and are not redeemable for cash and cannot be combined with any other coupons.</li>
                <li>Coupons are valid only for diagnostic services offered by the company.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#11243E] mb-4">5. Cancellation & Refund Policy</h2>
              <p className="mb-4">
                This policy is made to ensure proper transparency between the Customer & Company. Any Customer desirous of making a refund request need to follow the guideline as have been laid down in this document.
              </p>
              <p>
                In the event a booking is cancelled by the customer subsequent to a successful payment, Accurate Pathalogy Laboratory shall be entitled to deduct applicable payment gateway or transaction processing charges incurred during the course of the original payment transaction.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-[#11243E] mb-4">Disclaimer: Report Authenticity</h2>
              <p className="mb-4">
                At Accurate Pathalogy Laboratory, we prioritize the integrity and authenticity of our reports. Each report processed by us has a QR code or Verification Key. This serves as proof of genuineness and verifies the accuracy of the report.
                Any instances of tampering or forgery of our reports will result in strict actions being taken against the individuals or organizations involved.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#11243E] mb-4">Contact Us</h2>
              <p className="mb-4">
                For questions or concerns regarding these Terms and Conditions, please contact us at: <strong>info@accuratepathlabs.in</strong> or call us at <strong>884 065 8081</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
