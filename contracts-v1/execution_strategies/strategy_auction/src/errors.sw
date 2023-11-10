library;

pub enum StrategyAuctionErrors {
    ExchangeAlreadyInitialized: (),
    OrderCancelledOrExpired: (),
    FeeTooHigh: (),
    CallerMustBeTheExchange: (),
    ItemIsNotOnAuction: (),
    OwnerCanNotPlaceBid: (),
    BidMustBeHigherThanPreviousOne: (),
    BidMustBeNonZero: (),
    BidMustBeHigherThanStartingPrice: (),
    ItemIsAlreadyOnAuction: (),
}
