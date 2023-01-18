library ownable_interface;

use std::identity::Identity;

abi Ownable {
    #[storage(read)]
    fn owner() -> Option<Identity>;

    #[storage(read)]
    fn admin() -> Option<Identity>;
}
