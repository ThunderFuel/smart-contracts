library;

pub enum StrategyAuctionErrors {
    OnlyOwner: (),
    OwnerInitialized: (),
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
