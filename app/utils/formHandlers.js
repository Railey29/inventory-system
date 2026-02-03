/**
 * Generic form submit handler for login, register, forgot password, etc.
 *
 * @param {object} params
 * @param {Event} params.e - The form submit event
 * @param {Function} params.controllerFn - The controller function (axios call)
 * @param {object} params.data - Data to pass to controller
 * @param {Function} [params.onSuccess] - Callback on success
 * @param {Function} [params.onError] - Callback on error
 * @param {Function} [params.setLoading] - Optional state setter for loading
 */
export const handleFormSubmit = async ({
  e,
  controllerFn,
  data,
  onSuccess,
  onError,
  setLoading,
}) => {
  e.preventDefault();
  if (setLoading) setLoading(true);

  try {
    const res = await controllerFn(data);
    if (onSuccess) onSuccess(res);
  } catch (err) {
    if (onError) onError(err);
    else alert(err.message);
  } finally {
    if (setLoading) setLoading(false);
  }
};
