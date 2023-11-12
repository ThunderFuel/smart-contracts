library;

pub enum StrategyAuctionErrors {
    OnlyOwner: (),
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
