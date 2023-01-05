library ownable_interface;

use std::identity::Identity;

abi Ownable {
    #[storage(read)]
    fn owner() -> Identity;

    #[storage(read)]
    fn admin() -> Identity;
}
