import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Array "mo:base/Array";



actor {
  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  transient let natMap = OrderedMap.Make<Nat>(Nat.compare);

  var conveyorBelt = textMap.fromIter<Text>(Iter.fromArray([("status", "static")]));
  var userProfiles : OrderedMap.Map<Nat, [Text]> = natMap.empty();

  public query func getConveyorBeltStatus() : async Text {
    switch (textMap.get(conveyorBelt, "status")) {
      case (?status) { status };
      case null { "unknown" };
    };
  };

  public func addPurchasedItem(userId : Nat, item : Text) : async () {
    let currentItems = switch (natMap.get(userProfiles, userId)) {
      case (?items) { items };
      case null { [] };
    };
    let updatedItems = Array.append(currentItems, [item]);
    userProfiles := natMap.put(userProfiles, userId, updatedItems);
  };

  public query func getPurchasedItems(userId : Nat) : async [Text] {
    switch (natMap.get(userProfiles, userId)) {
      case (?items) { items };
      case null { [] };
    };
  };
};

