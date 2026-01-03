"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("leads", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

      name: { type: Sequelize.STRING(150), allowNull: false },
      email: { type: Sequelize.STRING(255), allowNull: false },

      country_code: { type: Sequelize.STRING(10), allowNull: false },
      phone_number: { type: Sequelize.STRING(20), allowNull: false },
      full_phone: { type: Sequelize.STRING(30), allowNull: false },

      company_name: { type: Sequelize.STRING, allowNull: true },
      city: { type: Sequelize.STRING, allowNull: true },

      sales_team_size: {
        type: Sequelize.ENUM(
          "SIZE_0_5",
          "SIZE_5_10",
          "SIZE_10_25",
          "SIZE_25_50",
          "SIZE_50_100",
          "ABOVE_100"
        ),
        allowNull: true
      },

      heard_from: {
        type: Sequelize.ENUM(
          "GOOGLE_SEARCH",
          "FB_INSTAGRAM",
          "SOCIAL_MEDIA",
          "REFERENCE",
          "INFLUENCER",
          "OTHERS"
        ),
        allowNull: true
      },

      heard_from_text: { type: Sequelize.STRING, allowNull: true },

      status: {
        type: Sequelize.ENUM(
          "PENDING_CRM",
          "RETRYING",
          "SENT_TO_CRM",
          "FAILED"
        ),
        allowNull: false,
        defaultValue: "PENDING_CRM"
      },

      retry_count: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW")
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW")
      }
    });

    // Proper indexes
    await queryInterface.addIndex("leads", ["email"], {
      unique: true,
      name: "idx_leads_email"
    });

    await queryInterface.addIndex("leads", ["status"], {
      name: "idx_leads_status"
    });

    await queryInterface.addIndex("leads", ["status", "retry_count"], {
      name: "idx_leads_status_retry"
    });

    await queryInterface.addIndex("leads", ["created_at"], {
      name: "idx_leads_created_at"
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("leads");
  }
};
