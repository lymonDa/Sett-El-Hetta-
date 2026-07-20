import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { callAdminFunction } from '@/lib/api';
import AdminLayout from '@/pages/admin/components/AdminLayout';
import { motion, AnimatePresence } from 'motion/react';

interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  created_at: string;
}

const ROLE_LABELS: Record<string, string> = {
  OWNER: 'admin.role.owner',
  STAFF: 'admin.role.staff',
  DELIVERY_COORDINATOR: 'admin.role.delivery',
};

const ROLE_CLASSES: Record<string, string> = {
  OWNER: 'bg-gold-50 text-gold-700 border-gold-200',
  STAFF: 'bg-espresso-50 text-espresso-700 border-espresso-200',
  DELIVERY_COORDINATOR: 'bg-green-50 text-green-700 border-green-200',
};

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const { admin } = useAdminAuthStore();
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState('STAFF');
  const [formError, setFormError] = useState<string | null>(null);

  // Toggle confirm
  const [toggleTarget, setToggleTarget] = useState<AdminUserItem | null>(null);
  const [showToggleConfirm, setShowToggleConfirm] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!admin) return;
    setLoading(true);
    setError(null);
    try {
      const result = await callAdminFunction('get_admin_users', { adminId: admin.id });
      setUsers((result as { users: AdminUserItem[] }).users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [admin]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormRole('STAFF');
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (user: AdminUserItem) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPassword('');
    setFormRole(user.role);
    setFormError(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admin) return;
    setFormError(null);

    if (!formName.trim() || !formEmail.trim() || !formRole) {
      setFormError(t('admin.users.fillAllFields'));
      return;
    }

    if (!editingUser && !formPassword) {
      setFormError(t('admin.users.passwordRequired'));
      return;
    }

    setSaving(true);

    try {
      if (editingUser) {
        const payload: Record<string, unknown> = {
          adminId: admin.id,
          targetUserId: editingUser.id,
          name: formName.trim(),
          email: formEmail.trim(),
          role: formRole,
        };
        if (formPassword) {
          payload.password = formPassword;
        }
        await callAdminFunction('update_admin_user', payload);
      } else {
        await callAdminFunction('create_admin_user', {
          adminId: admin.id,
          name: formName.trim(),
          email: formEmail.trim(),
          password: formPassword,
          role: formRole,
        });
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    if (!admin || !toggleTarget) return;
    setSaving(true);
    try {
      await callAdminFunction('toggle_admin_user', {
        adminId: admin.id,
        targetUserId: toggleTarget.id,
        active: !toggleTarget.active,
      });
      setShowToggleConfirm(false);
      setToggleTarget(null);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Toggle failed');
      setShowToggleConfirm(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 md:mb-8"
        >
          <div>
            <h1 className="font-heading font-black text-xl md:text-2xl text-espresso-900">{t('admin.users.title')}</h1>
            <p className="font-body text-xs md:text-sm text-espresso-500 mt-1">{t('admin.users.subtitle', { count: users.length })}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 text-white font-heading font-semibold text-sm hover:bg-gold-600 transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            <i className="ri-user-add-line"></i>
            {t('admin.users.addUser')}
          </motion.button>
        </motion.div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-2 text-espresso-500 font-body text-sm">
              <i className="ri-loader-4-line animate-spin"></i>
              {t('common.loading')}
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-body border border-red-200 mb-6">
            <i className="ri-error-warning-line text-lg"></i>
            <span>{error}</span>
            <button onClick={fetchUsers} className="ml-auto px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 transition-colors text-xs font-heading cursor-pointer whitespace-nowrap">
              {t('common.retry')}
            </button>
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 flex items-center justify-center mx-auto rounded-full bg-cream-100 text-espresso-400 mb-4">
              <i className="ri-user-settings-line text-2xl"></i>
            </div>
            <p className="font-body text-espresso-500">{t('admin.users.noUsers')}</p>
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-2xl border border-cream-200 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cream-200 bg-cream-50/50">
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs text-espresso-500 whitespace-nowrap">{t('admin.users.colName')}</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs text-espresso-500 whitespace-nowrap">{t('admin.users.colEmail')}</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs text-espresso-500 whitespace-nowrap">{t('admin.users.colRole')}</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs text-espresso-500 whitespace-nowrap">{t('admin.users.colStatus')}</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold text-xs text-espresso-500 whitespace-nowrap">{t('admin.users.colJoined')}</th>
                    <th className="text-right py-3 px-4 font-heading font-semibold text-xs text-espresso-500 whitespace-nowrap"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-cream-100 hover:bg-cream-50/30 transition-colors">
                      <td className="py-3 px-4 font-body font-medium text-espresso-900 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-cream-100 text-espresso-600 font-heading font-bold text-xs shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          {user.name}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-body text-espresso-600 text-xs whitespace-nowrap">{user.email}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-body border ${ROLE_CLASSES[user.role] || 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                          {t(ROLE_LABELS[user.role] || user.role)}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {user.active ? (
                          <span className="inline-flex items-center gap-1 text-xs font-body text-green-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            {t('admin.users.active')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-body text-red-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                            {t('admin.users.inactive')}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-body text-espresso-500 text-xs whitespace-nowrap">
                        {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(user)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-cream-100 text-espresso-400 hover:text-espresso-700 transition-colors cursor-pointer"
                            title={t('common.edit')}
                          >
                            <i className="ri-pencil-line text-sm"></i>
                          </button>
                          {user.id !== admin?.id && (
                            <button
                              onClick={() => { setToggleTarget(user); setShowToggleConfirm(true); }}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                                user.active
                                  ? 'hover:bg-red-50 text-espresso-400 hover:text-red-500'
                                  : 'hover:bg-green-50 text-espresso-400 hover:text-green-600'
                              }`}
                              title={user.active ? t('admin.users.deactivate') : t('admin.users.activate')}
                            >
                              <i className={`${user.active ? 'ri-user-unfollow-line' : 'ri-user-follow-line'} text-sm`}></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <>
              <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowModal(false)}></div>
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-white rounded-2xl border border-cream-200 w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                  <h2 className="font-heading font-bold text-lg text-espresso-900 mb-1">
                    {editingUser ? t('admin.users.editUser') : t('admin.users.createUser')}
                  </h2>
                  <p className="font-body text-xs text-espresso-500 mb-5">
                    {editingUser ? t('admin.users.editUserDesc') : t('admin.users.createUserDesc')}
                  </p>

                  {formError && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-body mb-4 border border-red-200">
                      <i className="ri-error-warning-line"></i>
                      {formError}
                    </div>
                  )}

                  <form onSubmit={handleSave} className="space-y-4">
                    <div>
                      <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('admin.users.name')}</label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 bg-white"
                        placeholder={t('admin.users.namePlaceholder')}
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('admin.users.email')}</label>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 bg-white"
                        placeholder="user@sett-el-hetta.com"
                        dir="ltr"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">
                        {t('admin.users.password')}
                        {editingUser && <span className="text-espresso-400 font-normal text-xs ml-1">({t('admin.users.passwordOptional')})</span>}
                      </label>
                      <input
                        type="password"
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-cream-300 font-body text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200/50 bg-white"
                        placeholder="••••••••"
                        dir="ltr"
                        minLength={4}
                        required={!editingUser}
                      />
                    </div>
                    <div>
                      <label className="block font-heading font-medium text-sm text-espresso-900 mb-1.5">{t('admin.users.role')}</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['OWNER', 'STAFF', 'DELIVERY_COORDINATOR'] as const).map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setFormRole(role)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-heading font-medium border transition-all cursor-pointer whitespace-nowrap ${
                              formRole === role
                                ? ROLE_CLASSES[role] + ' ring-1 ring-offset-1'
                                : 'border-cream-200 text-espresso-500 hover:border-cream-300'
                            }`}
                          >
                            {t(ROLE_LABELS[role])}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 py-2.5 rounded-xl border border-cream-300 text-espresso-600 font-heading font-medium text-sm hover:bg-cream-50 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {t('common.cancel')}
                      </button>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={saving}
                        className="flex-1 py-2.5 rounded-xl bg-gold-500 text-white font-heading font-semibold text-sm hover:bg-gold-600 disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {saving ? (
                          <span className="flex items-center justify-center gap-1.5"><i className="ri-loader-4-line animate-spin text-sm"></i>{t('common.saving')}</span>
                        ) : editingUser ? t('common.save') : t('admin.users.create')}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Toggle Confirm Modal */}
        <AnimatePresence>
          {showToggleConfirm && toggleTarget && (
            <>
              <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowToggleConfirm(false)}></div>
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-white rounded-2xl border border-cream-200 w-full max-w-sm p-6">
                  <div className="w-11 h-11 flex items-center justify-center rounded-full bg-yellow-50 text-yellow-600 mb-4 mx-auto">
                    <i className={`${toggleTarget.active ? 'ri-user-unfollow-line' : 'ri-user-follow-line'} text-xl`}></i>
                  </div>
                  <h2 className="font-heading font-bold text-base text-espresso-900 text-center mb-1">
                    {toggleTarget.active ? t('admin.users.deactivateTitle') : t('admin.users.activateTitle')}
                  </h2>
                  <p className="font-body text-sm text-espresso-500 text-center mb-5">
                    {toggleTarget.active
                      ? t('admin.users.deactivateConfirm', { name: toggleTarget.name })
                      : t('admin.users.activateConfirm', { name: toggleTarget.name })}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowToggleConfirm(false)}
                      className="flex-1 py-2.5 rounded-xl border border-cream-300 text-espresso-600 font-heading font-medium text-sm hover:bg-cream-50 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {t('common.cancel')}
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleToggle}
                      disabled={saving}
                      className={`flex-1 py-2.5 rounded-xl font-heading font-semibold text-sm disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap ${
                        toggleTarget.active
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {saving ? (
                        <span className="flex items-center justify-center gap-1.5"><i className="ri-loader-4-line animate-spin text-sm"></i>{t('common.saving')}</span>
                      ) : toggleTarget.active ? t('admin.users.deactivate') : t('admin.users.activate')}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}