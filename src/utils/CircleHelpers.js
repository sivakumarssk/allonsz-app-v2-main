/**
 * Helper functions for circle management
 */

/**
 * Check if a circle is a 5-member circle
 * @param {Object} circle - Circle object from API
 * @returns {boolean}
 */
export function is5MemberCircle(circle) {
  return circle?.package?.total_members === 5;
}

/**
 * Get circle status information
 * @param {Object} circle - Circle object from API
 * @returns {Object} Status object with status, progress, message, etc.
 */
export function getCircleStatus(circle) {
  if (is5MemberCircle(circle)) {
    if (circle.status === "Completed") {
      return {
        status: "completed",
        message:
          circle.completion_message ||
          "Circle completed. Please update the package.",
      };
    }

    const filledCount = circle.members.filter(
      (m) => m.status === "Occupied"
    ).length;
    return {
      status: "active",
      progress: `${filledCount}/5`,
      remaining: 5 - filledCount,
      filledCount: filledCount,
    };
  }

  // Handle other circle types (2, 3, 4 members)
  return {
    status: circle.status?.toLowerCase() || "active",
    progress: null,
    remaining: null,
  };
}

/**
 * Check if circle is part of combo package
 * @param {Object} circle - Circle object from API
 * @returns {boolean}
 */
export function isComboCircle(circle) {
  // Combo circles have a 'section' field (five_a, five_b, five_c, twentyone)
  // Regular circles don't have this field
  if (circle?.section) {
    return true;
  }
  // Also check package flag for backward compatibility
  return circle?.package?.is_combo == 1 || circle?.is_combo == 1;
}

/**
 * Map backend section name to frontend section name
 * @param {string} section - Backend section name ('five_a', 'five_b', 'five_c', 'twentyone')
 * @returns {string} Frontend section name ('5_member_1', '5_member_2', '5_member_3', '21_member')
 */
export function mapSectionName(section) {
  const mapping = {
    "five_a": "5_member_1",
    "five_b": "5_member_2",
    "five_c": "5_member_3",
    "twentyone": "21_member",
    // Also support frontend format if already mapped
    "5_member_1": "5_member_1",
    "5_member_2": "5_member_2",
    "5_member_3": "5_member_3",
    "21_member": "21_member",
  };
  return mapping[section] || section;
}

/**
 * Get combo section name for display
 * @param {string} section - Combo section type ('5_member_1', '5_member_2', '21_member' or 'five_a', 'five_b', 'twentyone')
 * @param {string} sectionName - Optional: Custom section name from API (prioritized if provided)
 * @returns {string} Display name for the section
 */
export function getComboSectionName(section, sectionName = null) {
  // If custom section_name is provided from API, use it
  if (sectionName) {
    return sectionName;
  }
  
  // Map backend format to frontend format first
  const mappedSection = mapSectionName(section);
  
  // Default names if no custom name provided
  const names = {
    "5_member_1": "5-Member Circle 1",
    "5_member_2": "5-Member Circle 2",
    "5_member_3": "5-Member Circle 3",
    "21_member": "21-Member Circle",
  };
  return names[mappedSection] || section;
}

/**
 * Format combo circle display name
 * @param {Object} circle - Circle object from API
 * @returns {string} Formatted circle name
 */
export function formatComboCircleName(circle) {
  if (!isComboCircle(circle)) {
    return circle.name;
  }

  // Backend uses 'section' field, frontend might use 'combo_section'
  const section = circle.section || circle.combo_section || circle.combo_circle?.circle_type;
  const circleNumber =
    circle.cycle || circle.combo_circle_number || circle.combo_circle?.circle_number || 1;
  
  // Use section_name from API if available (NEW API change)
  // section_name uses custom names from package or defaults
  // For 5-member circles (five_a, five_b), fallback to package section names or getComboSectionName
  let sectionName;
  
  // Check if section_name exists and is not empty
  if (circle.section_name && circle.section_name.trim() !== "") {
    sectionName = circle.section_name;
  } else if (section && circle.package) {
    // Fallback: Try to get section name from package (backend might not set section_name for 5-member circles)
    // This handles cases where section_name is missing from API
    if (section === "five_a" && circle.package.combo_five_a_name) {
      sectionName = circle.package.combo_five_a_name;
    } else if (section === "five_b" && circle.package.combo_five_b_name) {
      sectionName = circle.package.combo_five_b_name;
    } else if (section === "five_c" && circle.package.combo_five_c_name) {
      sectionName = circle.package.combo_five_c_name;
    } else if (section === "twentyone" && circle.package.combo_twentyone_name) {
      sectionName = circle.package.combo_twentyone_name;
    } else {
      // Last fallback: use section to get default name
      sectionName = getComboSectionName(section);
    }
  } else if (section) {
    // Fallback: use section to get default name (works for five_a, five_b, five_c, twentyone)
    sectionName = getComboSectionName(section);
  } else {
    // Last resort: use a generic name
    sectionName = "Combo Circle";
  }

  // Debug logging to help identify issues
  console.log("formatComboCircleName - Circle:", {
    id: circle.id,
    section: circle.section,
    section_name: circle.section_name,
    computed_sectionName: sectionName,
    cycle: circleNumber,
    isCombo: isComboCircle(circle)
  });

  return `${sectionName} (Circle #${circleNumber})`;
}
