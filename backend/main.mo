import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor {
  // US National Holidays (simplified for demonstration)
  let holidays = [
    (1, 1, "New Year's Day"),
    (7, 4, "Independence Day"),
    (11, 11, "Veterans Day"),
    (12, 25, "Christmas Day")
  ];

  public query func getHolidays(year: Nat) : async [(Nat, Nat, Text)] {
    // In a real-world scenario, we would calculate variable holidays like
    // Thanksgiving, Memorial Day, etc. based on the given year.
    // For simplicity, we're returning a fixed set of holidays.
    holidays
  };
}
