// Which disability communities are affected by a barrier in a given WCAG SC.
// Used by the report to state "who is affected" for each finding. Community IDs
// match `DISABILITY_COMMUNITIES` in src/lib/review/disability-matching.ts.

export type CommunityId =
  | "blind_screen_reader"
  | "low_vision"
  | "deaf_hard_of_hearing"
  | "motor_mobility"
  | "cognitive"
  | "photosensitive"
  | "speech";

// The full WCAG 2.2 set, mapped to the communities whose access a failure would
// impair. Broad where a barrier affects many groups; specific where it doesn't.
export const SC_AFFECTED_COMMUNITIES: Record<string, readonly CommunityId[]> = {
  // 1.1 Text alternatives
  "1.1.1": ["blind_screen_reader", "low_vision"],

  // 1.2 Time-based media
  "1.2.1": ["deaf_hard_of_hearing", "blind_screen_reader"],
  "1.2.2": ["deaf_hard_of_hearing"],
  "1.2.3": ["blind_screen_reader"],
  "1.2.4": ["deaf_hard_of_hearing"],
  "1.2.5": ["blind_screen_reader"],
  "1.2.6": ["deaf_hard_of_hearing"],
  "1.2.7": ["blind_screen_reader"],
  "1.2.8": ["deaf_hard_of_hearing"],
  "1.2.9": ["deaf_hard_of_hearing"],

  // 1.3 Adaptable
  "1.3.1": ["blind_screen_reader"],
  "1.3.2": ["blind_screen_reader"],
  "1.3.3": ["blind_screen_reader", "low_vision"],
  "1.3.4": ["motor_mobility", "low_vision"],
  "1.3.5": ["cognitive"],
  "1.3.6": ["blind_screen_reader", "cognitive"],

  // 1.4 Distinguishable
  "1.4.1": ["low_vision", "blind_screen_reader"],
  "1.4.2": ["deaf_hard_of_hearing", "cognitive"],
  "1.4.3": ["low_vision"],
  "1.4.4": ["low_vision"],
  "1.4.5": ["low_vision", "blind_screen_reader"],
  "1.4.6": ["low_vision"],
  "1.4.7": ["deaf_hard_of_hearing", "cognitive"],
  "1.4.8": ["low_vision"],
  "1.4.9": ["low_vision", "blind_screen_reader"],
  "1.4.10": ["low_vision"],
  "1.4.11": ["low_vision"],
  "1.4.12": ["low_vision", "cognitive"],
  "1.4.13": ["low_vision", "motor_mobility", "cognitive"],

  // 2.1 Keyboard accessible
  "2.1.1": ["motor_mobility"],
  "2.1.2": ["motor_mobility", "blind_screen_reader"],
  "2.1.3": ["motor_mobility"],
  "2.1.4": ["motor_mobility"],

  // 2.2 Enough time
  "2.2.1": ["cognitive", "motor_mobility"],
  "2.2.2": ["cognitive", "photosensitive"],
  "2.2.3": ["cognitive"],
  "2.2.4": ["cognitive"],
  "2.2.5": ["cognitive"],
  "2.2.6": ["cognitive"],

  // 2.3 Seizures and physical reactions
  "2.3.1": ["photosensitive"],
  "2.3.2": ["photosensitive"],
  "2.3.3": ["photosensitive", "cognitive"],

  // 2.4 Navigable
  "2.4.1": ["blind_screen_reader", "motor_mobility"],
  "2.4.2": ["cognitive", "blind_screen_reader"],
  "2.4.3": ["blind_screen_reader", "motor_mobility"],
  "2.4.4": ["blind_screen_reader", "cognitive"],
  "2.4.5": ["cognitive", "motor_mobility"],
  "2.4.6": ["blind_screen_reader", "cognitive"],
  "2.4.7": ["motor_mobility", "low_vision"],
  "2.4.8": ["cognitive", "blind_screen_reader"],
  "2.4.9": ["blind_screen_reader", "cognitive"],
  "2.4.10": ["blind_screen_reader", "cognitive"],
  "2.4.11": ["motor_mobility", "low_vision"],
  "2.4.12": ["motor_mobility", "low_vision"],
  "2.4.13": ["motor_mobility", "low_vision"],

  // 2.5 Input modalities
  "2.5.1": ["motor_mobility"],
  "2.5.2": ["motor_mobility"],
  "2.5.3": ["blind_screen_reader", "speech"],
  "2.5.4": ["motor_mobility"],
  "2.5.5": ["motor_mobility"],
  "2.5.6": ["motor_mobility"],
  "2.5.7": ["motor_mobility"],
  "2.5.8": ["motor_mobility"],

  // 3.1 Readable
  "3.1.1": ["blind_screen_reader"],
  "3.1.2": ["blind_screen_reader"],
  "3.1.3": ["cognitive"],
  "3.1.4": ["cognitive", "blind_screen_reader"],
  "3.1.5": ["cognitive"],
  "3.1.6": ["blind_screen_reader", "speech"],

  // 3.2 Predictable
  "3.2.1": ["cognitive", "motor_mobility"],
  "3.2.2": ["cognitive"],
  "3.2.3": ["cognitive"],
  "3.2.4": ["cognitive"],
  "3.2.5": ["cognitive"],
  "3.2.6": ["cognitive"],

  // 3.3 Input assistance
  "3.3.1": ["blind_screen_reader", "cognitive"],
  "3.3.2": ["cognitive", "blind_screen_reader"],
  "3.3.3": ["cognitive"],
  "3.3.4": ["cognitive"],
  "3.3.5": ["cognitive"],
  "3.3.6": ["cognitive"],
  "3.3.7": ["cognitive", "motor_mobility"],
  "3.3.8": ["cognitive"],
  "3.3.9": ["cognitive"],

  // 4.1 Compatible
  "4.1.1": ["blind_screen_reader"],
  "4.1.2": ["blind_screen_reader"],
  "4.1.3": ["blind_screen_reader"],
};

// Communities whose access a failure of `sc` impairs. Empty when the SC is not
// mapped (treated as "affects users generally").
export function communitiesAffectedBySc(sc: string): readonly CommunityId[] {
  return SC_AFFECTED_COMMUNITIES[sc] ?? [];
}
