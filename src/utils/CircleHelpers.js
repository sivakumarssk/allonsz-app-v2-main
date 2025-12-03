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

