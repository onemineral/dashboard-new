import { UserClient } from "./user";
import { TenantClient } from "./tenant";
import { AccountClient } from "./account";
import { PartnerAccountClient } from "./partner-account";
import { GuestAccountClient } from "./guest-account";
import { ProfileClient } from "./profile";
import { ProfileSettingsClient } from "./profile-settings";
import { LegalEntityClient } from "./legal-entity";
import { RentalAgreementClient } from "./rental-agreement";
import { SettingsClient } from "./settings";
import { WebhookClient } from "./webhook";
import { CurrencyClient } from "./currency";
import { CountryClient } from "./country";
import { LanguageClient } from "./language";
import { PropertyClient } from "./property";
import { AmenityClient } from "./amenity";
import { AmenityGroupClient } from "./amenity-group";
import { PropertyTypeClient } from "./property-type";
import { LocationClient } from "./location";
import { PropertyRoomClient } from "./property-room";
import { BedTypeClient } from "./bed-type";
import { RegionClient } from "./region";
import { ReviewClient } from "./review";
import { SeoClient } from "./seo";
import { TagClient } from "./tag";
import { CollectionClient } from "./collection";
import { DiscountClient } from "./discount";
import { DocumentTemplateClient } from "./document-template";
import { DocumentClient } from "./document";
import { PaymentScheduleClient } from "./payment-schedule";
import { PaymentScheduleStepClient } from "./payment-schedule-step";
import { PaymentGatewayClient } from "./payment-gateway";
import { CreditCardClient } from "./credit-card";
import { PaymentMethodClient } from "./payment-method";
import { PaymentClient } from "./payment";
import { SecurityDepositClient } from "./security-deposit";
import { StripeClient } from "./stripe";
import { PaymentProviderClient } from "./payment-provider";
import { PropertyIcalClient } from "./property-ical";
import { AvailabilityClient } from "./availability";
import { AvailabilityStatusClient } from "./availability-status";
import { PropertyLosSeasonClient } from "./property-los-season";
import { PropertyLosSeasonDiscountClient } from "./property-los-season-discount";
import { FeeTypeClient } from "./fee-type";
import { LosTemplateClient } from "./los-template";
import { TaxClassClient } from "./tax-class";
import { PersonalAccessTokenClient } from "./personal-access-token";
import { IdentityClient } from "./identity";
import { BookingClient } from "./booking";
import { BookingProductClient } from "./booking-product";
import { BookingGuestClient } from "./booking-guest";
import { BookingStatementClient } from "./booking-statement";
import { BookingStatementTemplateClient } from "./booking-statement-template";
import { InquiryClient } from "./inquiry";
import { InquiryStageClient } from "./inquiry-stage";
import { InquiryQuoteClient } from "./inquiry-quote";
import { NotificationClient } from "./notification";
import { ChannelClient } from "./channel";
import { ChannelPropertyClient } from "./channel-property";
import { ChannelManagerSyncClient } from "./channel-manager-sync";
import { AnalyticsClient } from "./analytics";
import { ReportClient } from "./report";
import { ServiceClient } from "./service";
import { ServiceTypeClient } from "./service-type";
import { ServiceRequestClient } from "./service-request";
import { OnlineCheckinConfigClient } from "./online-checkin-config";
import { OnlineCheckinClient } from "./online-checkin";
import { SupplierTypeClient } from "./supplier-type";
import { AirbnbClient } from "./airbnb";
import { AirbnbPropertyClient } from "./airbnb-property";
import { HomeawayClient } from "./homeaway";
import { HomeawayPropertyClient } from "./homeaway-property";
import { ApiPartnerClient } from "./api-partner";
import { BookingComClient } from "./booking-com";
import { BookingComPropertyClient } from "./booking-com-property";
import { BookingComLegalEntityClient } from "./booking-com-legal-entity";
import { BreezewayClient } from "./breezeway";
import { BreezewayPropertyClient } from "./breezeway-property";
import { RentalsUnitedClient } from "./rentals-united";
import { RentalsUnitedPropertyClient } from "./rentals-united-property";
import { GoogleVrClient } from "./google-vr";
import { GoogleVrPropertyClient } from "./google-vr-property";
import { SuperhogClient } from "./superhog";
import { SuperhogPropertyClient } from "./superhog-property";
import { PriceLabsClient } from "./price-labs";
import { PriceLabsPropertyClient } from "./price-labs-property";
import { HoliduClient } from "./holidu";
import { HoliduPropertyClient } from "./holidu-property";
import { MakemytripClient } from "./makemytrip";
import { MakemytripPropertyClient } from "./makemytrip-property";
import { ManagedIntegrationClient } from "./managed-integration";
import { VideoClient } from "./video";
import { SubscriptionClient } from "./subscription";
import { WebsiteNavigationClient } from "./website-navigation";
import { WebsiteChannelClient } from "./website-channel";
import { WebsiteDomainClient } from "./website-domain";
import { WebsitePageClient } from "./website-page";
import { WebsiteTranslationClient } from "./website-translation";
import { UmamiWebsiteClient } from "./umami-website";
import { NotificationLayoutClient } from "./notification-layout";
import { NotificationTemplateClient } from "./notification-template";
import { EmailConfigurationClient } from "./email-configuration";
import { ThreadClient } from "./thread";
import { ThreadMessageClient } from "./thread-message";
import { MessageProviderClient } from "./message-provider";
import { InboxConfigurationClient } from "./inbox-configuration";
import { KnowledgebaseClient } from "./knowledgebase";
import { TranslationClient } from "./translation";
import { WorkflowClient } from "./workflow";
import { WorkflowScheduleClient } from "./workflow-schedule";
import { DtravelClient } from "./dtravel";
import { DtravelPropertyClient } from "./dtravel-property";
import { ZapierClient } from "./zapier";
import { WheelhouseClient } from "./wheelhouse";
import { WheelhousePropertyClient } from "./wheelhouse-property";
import { ApiClient } from "../api-client";

export * from "./activity";
export * from "./user";
export * from "./tenant";
export * from "./account";
export * from "./partner-account";
export * from "./guest-account";
export * from "./profile";
export * from "./profile-settings";
export * from "./mutation";
export * from "./legal-entity";
export * from "./tenant-policy";
export * from "./rental-agreement";
export * from "./tenant-settings";
export * from "./tracking";
export * from "./settings";
export * from "./data";
export * from "./search";
export * from "./webhook";
export * from "./tenant-billing";
export * from "./file";
export * from "./currency";
export * from "./currency-conversion-rate";
export * from "./country";
export * from "./language";
export * from "./property";
export * from "./property-policy";
export * from "./property-rates-settings";
export * from "./property-host-revenue-share";
export * from "./amenity";
export * from "./amenity-group";
export * from "./property-type";
export * from "./location";
export * from "./property-room";
export * from "./property-room-bed";
export * from "./bed-type";
export * from "./region";
export * from "./review";
export * from "./quote";
export * from "./image";
export * from "./seo";
export * from "./tag";
export * from "./collection";
export * from "./discount";
export * from "./applicable-discount";
export * from "./document-template";
export * from "./document";
export * from "./payment-schedule";
export * from "./payment-schedule-step";
export * from "./payment-gateway";
export * from "./credit-card";
export * from "./payment-method";
export * from "./payment";
export * from "./security-deposit";
export * from "./stripe";
export * from "./payment-provider";
export * from "./rates-availability";
export * from "./property-ical";
export * from "./availability";
export * from "./availability-status";
export * from "./availability-range";
export * from "./property-los-season";
export * from "./property-los-season-discount";
export * from "./fee-type";
export * from "./property-fee";
export * from "./unavailability";
export * from "./availability-details";
export * from "./rates-availability-range";
export * from "./los-template";
export * from "./property-occupancy-season";
export * from "./property-occupancy-rate";
export * from "./tax";
export * from "./tax-class";
export * from "./calculated-tax";
export * from "./personal-access-token";
export * from "./identity";
export * from "./booking";
export * from "./booking-product";
export * from "./booking-product-line-item";
export * from "./booking-payment-schedule-step";
export * from "./booking-ta-commission";
export * from "./booking-host-revenue-share";
export * from "./import-bulk-booking";
export * from "./booking-guest";
export * from "./booking-statement";
export * from "./booking-statement-template";
export * from "./inquiry";
export * from "./inquiry-stage";
export * from "./inquiry-quote";
export * from "./notification";
export * from "./channel";
export * from "./channel-property";
export * from "./channel-manager-sync";
export * from "./analytics";
export * from "./report";
export * from "./health-score";
export * from "./service";
export * from "./service-type";
export * from "./service-request";
export * from "./online-checkin-config";
export * from "./online-checkin";
export * from "./supplier-type";
export * from "./airbnb";
export * from "./airbnb-property";
export * from "./homeaway";
export * from "./homeaway-property";
export * from "./api-partner";
export * from "./api-partner-auth";
export * from "./booking-com";
export * from "./booking-com-property";
export * from "./booking-com-legal-entity";
export * from "./breezeway";
export * from "./breezeway-property";
export * from "./rentals-united";
export * from "./rentals-united-property";
export * from "./google-vr";
export * from "./google-vr-property";
export * from "./superhog";
export * from "./superhog-property";
export * from "./price-labs";
export * from "./price-labs-property";
export * from "./holidu";
export * from "./holidu-property";
export * from "./makemytrip";
export * from "./makemytrip-property";
export * from "./managed-integration";
export * from "./video";
export * from "./subscription";
export * from "./website-navigation";
export * from "./grouped-website-navigation";
export * from "./website-channel";
export * from "./website-domain";
export * from "./website-page";
export * from "./website-translation";
export * from "./booking-website";
export * from "./property-website";
export * from "./umami-website";
export * from "./notification-layout";
export * from "./notification-template";
export * from "./email-configuration";
export * from "./thread";
export * from "./thread-message";
export * from "./message-provider";
export * from "./messaging-account";
export * from "./inbox-configuration";
export * from "./knowledgebase";
export * from "./translation";
export * from "./workflow";
export * from "./workflow-schedule";
export * from "./dtravel";
export * from "./dtravel-property";
export * from "./zapier";
export * from "./wheelhouse";
export * from "./wheelhouse-property";

export function init(apiClient: ApiClient) {
    return {
        user: new UserClient(apiClient),
        tenant: new TenantClient(apiClient),
        account: new AccountClient(apiClient),
        partnerAccount: new PartnerAccountClient(apiClient),
        guestAccount: new GuestAccountClient(apiClient),
        profile: new ProfileClient(apiClient),
        profileSettings: new ProfileSettingsClient(apiClient),
        legalEntity: new LegalEntityClient(apiClient),
        rentalAgreement: new RentalAgreementClient(apiClient),
        settings: new SettingsClient(apiClient),
        webhook: new WebhookClient(apiClient),
        currency: new CurrencyClient(apiClient),
        country: new CountryClient(apiClient),
        language: new LanguageClient(apiClient),
        property: new PropertyClient(apiClient),
        amenity: new AmenityClient(apiClient),
        amenityGroup: new AmenityGroupClient(apiClient),
        propertyType: new PropertyTypeClient(apiClient),
        location: new LocationClient(apiClient),
        propertyRoom: new PropertyRoomClient(apiClient),
        bedType: new BedTypeClient(apiClient),
        region: new RegionClient(apiClient),
        review: new ReviewClient(apiClient),
        seo: new SeoClient(apiClient),
        tag: new TagClient(apiClient),
        collection: new CollectionClient(apiClient),
        discount: new DiscountClient(apiClient),
        documentTemplate: new DocumentTemplateClient(apiClient),
        document: new DocumentClient(apiClient),
        paymentSchedule: new PaymentScheduleClient(apiClient),
        paymentScheduleStep: new PaymentScheduleStepClient(apiClient),
        paymentGateway: new PaymentGatewayClient(apiClient),
        creditCard: new CreditCardClient(apiClient),
        paymentMethod: new PaymentMethodClient(apiClient),
        payment: new PaymentClient(apiClient),
        securityDeposit: new SecurityDepositClient(apiClient),
        stripe: new StripeClient(apiClient),
        paymentProvider: new PaymentProviderClient(apiClient),
        propertyIcal: new PropertyIcalClient(apiClient),
        availability: new AvailabilityClient(apiClient),
        availabilityStatus: new AvailabilityStatusClient(apiClient),
        propertyLosSeason: new PropertyLosSeasonClient(apiClient),
        propertyLosSeasonDiscount: new PropertyLosSeasonDiscountClient(apiClient),
        feeType: new FeeTypeClient(apiClient),
        losTemplate: new LosTemplateClient(apiClient),
        taxClass: new TaxClassClient(apiClient),
        personalAccessToken: new PersonalAccessTokenClient(apiClient),
        identity: new IdentityClient(apiClient),
        booking: new BookingClient(apiClient),
        bookingProduct: new BookingProductClient(apiClient),
        bookingGuest: new BookingGuestClient(apiClient),
        bookingStatement: new BookingStatementClient(apiClient),
        bookingStatementTemplate: new BookingStatementTemplateClient(apiClient),
        inquiry: new InquiryClient(apiClient),
        inquiryStage: new InquiryStageClient(apiClient),
        inquiryQuote: new InquiryQuoteClient(apiClient),
        notification: new NotificationClient(apiClient),
        channel: new ChannelClient(apiClient),
        channelProperty: new ChannelPropertyClient(apiClient),
        channelManagerSync: new ChannelManagerSyncClient(apiClient),
        analytics: new AnalyticsClient(apiClient),
        report: new ReportClient(apiClient),
        service: new ServiceClient(apiClient),
        serviceType: new ServiceTypeClient(apiClient),
        serviceRequest: new ServiceRequestClient(apiClient),
        onlineCheckinConfig: new OnlineCheckinConfigClient(apiClient),
        onlineCheckin: new OnlineCheckinClient(apiClient),
        supplierType: new SupplierTypeClient(apiClient),
        airbnb: new AirbnbClient(apiClient),
        airbnbProperty: new AirbnbPropertyClient(apiClient),
        homeaway: new HomeawayClient(apiClient),
        homeawayProperty: new HomeawayPropertyClient(apiClient),
        apiPartner: new ApiPartnerClient(apiClient),
        bookingCom: new BookingComClient(apiClient),
        bookingComProperty: new BookingComPropertyClient(apiClient),
        bookingComLegalEntity: new BookingComLegalEntityClient(apiClient),
        breezeway: new BreezewayClient(apiClient),
        breezewayProperty: new BreezewayPropertyClient(apiClient),
        rentalsUnited: new RentalsUnitedClient(apiClient),
        rentalsUnitedProperty: new RentalsUnitedPropertyClient(apiClient),
        googleVr: new GoogleVrClient(apiClient),
        googleVrProperty: new GoogleVrPropertyClient(apiClient),
        superhog: new SuperhogClient(apiClient),
        superhogProperty: new SuperhogPropertyClient(apiClient),
        priceLabs: new PriceLabsClient(apiClient),
        priceLabsProperty: new PriceLabsPropertyClient(apiClient),
        holidu: new HoliduClient(apiClient),
        holiduProperty: new HoliduPropertyClient(apiClient),
        makemytrip: new MakemytripClient(apiClient),
        makemytripProperty: new MakemytripPropertyClient(apiClient),
        managedIntegration: new ManagedIntegrationClient(apiClient),
        video: new VideoClient(apiClient),
        subscription: new SubscriptionClient(apiClient),
        websiteNavigation: new WebsiteNavigationClient(apiClient),
        websiteChannel: new WebsiteChannelClient(apiClient),
        websiteDomain: new WebsiteDomainClient(apiClient),
        websitePage: new WebsitePageClient(apiClient),
        websiteTranslation: new WebsiteTranslationClient(apiClient),
        umamiWebsite: new UmamiWebsiteClient(apiClient),
        notificationLayout: new NotificationLayoutClient(apiClient),
        notificationTemplate: new NotificationTemplateClient(apiClient),
        emailConfiguration: new EmailConfigurationClient(apiClient),
        thread: new ThreadClient(apiClient),
        threadMessage: new ThreadMessageClient(apiClient),
        messageProvider: new MessageProviderClient(apiClient),
        inboxConfiguration: new InboxConfigurationClient(apiClient),
        knowledgebase: new KnowledgebaseClient(apiClient),
        translation: new TranslationClient(apiClient),
        workflow: new WorkflowClient(apiClient),
        workflowSchedule: new WorkflowScheduleClient(apiClient),
        dtravel: new DtravelClient(apiClient),
        dtravelProperty: new DtravelPropertyClient(apiClient),
        zapier: new ZapierClient(apiClient),
        wheelhouse: new WheelhouseClient(apiClient),
        wheelhouseProperty: new WheelhousePropertyClient(apiClient)
    };
}
