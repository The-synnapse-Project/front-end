// Permission model for role-based access control
export enum Role {
  ADMIN = "admin",
  PROFESOR = "profesor",
  ALUMNO = "alumno",
}

// Type helper for English role names
export const RoleNames = {
  [Role.ADMIN]: "Admin",
  [Role.PROFESOR]: "Teacher",
  [Role.ALUMNO]: "Student",
};

export class Permission {
  id: string;
  personId: string;
  dashboard: boolean;
  seeSelfHistory: boolean;
  seeOthersHistory: boolean;
  adminPanel: boolean;
  editPermissions: boolean;

  constructor(
    id: string,
    personId: string,
    options: {
      dashboard?: boolean;
      seeSelfHistory?: boolean;
      seeOthersHistory?: boolean;
      adminPanel?: boolean;
      editPermissions?: boolean;
    } = {},
  ) {
    this.id = id;
    this.personId = personId;
    this.dashboard = options.dashboard || false;
    this.seeSelfHistory = options.seeSelfHistory || false;
    this.seeOthersHistory = options.seeOthersHistory || false;
    this.adminPanel = options.adminPanel || false;
    this.editPermissions = options.editPermissions || false;
  }

  // Factory method to create Permission from API response
  static fromApiResponse(data: {
    id: string;
    person_id: string;
    dashboard: boolean;
    see_self_history: boolean;
    see_others_history: boolean;
    admin_panel: boolean;
    edit_permissions: boolean;
  }): Permission {
    return new Permission(data.id, data.person_id, {
      dashboard: data.dashboard,
      seeSelfHistory: data.see_self_history,
      seeOthersHistory: data.see_others_history,
      adminPanel: data.admin_panel,
      editPermissions: data.edit_permissions,
    });
  }

  // Convert to Role for easier use in UI
  getRole(): Role {
    if (this.adminPanel && this.editPermissions) {
      return Role.ADMIN;
    } else if (this.seeOthersHistory) {
      return Role.PROFESOR;
    } else {
      return Role.ALUMNO;
    }
  }

  // Create permission defaults for a specific role
  static fromRole(id: string, personId: string, role: Role): Permission {
    switch (role) {
      case Role.ADMIN:
        return new Permission(id, personId, {
          dashboard: true,
          seeSelfHistory: true,
          seeOthersHistory: true,
          adminPanel: true,
          editPermissions: true,
        });
      case Role.PROFESOR:
        return new Permission(id, personId, {
          dashboard: true,
          seeSelfHistory: true,
          seeOthersHistory: true,
          adminPanel: false,
          editPermissions: false,
        });
      case Role.ALUMNO:
      default:
        return new Permission(id, personId, {
          dashboard: true,
          seeSelfHistory: true,
          seeOthersHistory: false,
          adminPanel: false,
          editPermissions: false,
        });
    }
  }

  // Convert to API request format
  toApiRequest() {
    return {
      id: this.id,
      person_id: this.personId,
      dashboard: this.dashboard,
      see_self_history: this.seeSelfHistory,
      see_others_history: this.seeOthersHistory,
      admin_panel: this.adminPanel,
      edit_permissions: this.editPermissions,
    };
  }
}
