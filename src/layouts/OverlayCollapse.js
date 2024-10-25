import useCollapseSidebar from 'hooks/useCollapseSidebar';

function OverlayCollapse() {
  const { isCollapseSidebar, toggleCollapse } = useCollapseSidebar();
  return (
    <>
      <input
        onChange={() => {}}
        id="collapsedTracker"
        type="checkbox"
        checked={!isCollapseSidebar}
      />
      <label
        htmlFor="collapsedTracker"
        className="overlay"
        onClick={toggleCollapse}
        role="presentation"
      />
    </>
  );
}

export default OverlayCollapse;
