import time
import sys

def pacing_valve(pass_number, tokens_processed):
    """
    Forces the harness to pause and let the API rate limits clear 
    between intense multi-file analysis passes.
    """
    # Large files take longer for 400B models to compute internally
    base_wait = 1.5 if tokens_processed < 20000 else 3.0
    
    print(f"\n⏱️ [HARNESS] Pass {pass_number} complete. Balancing API pacing...")
    
    # Force a hard clear window to reset the 40 requests-per-minute counter
    for remaining in range(int(base_wait * 10), 0, -1):
        sys.stdout.write(f"\r⏳ Pacing hold: {remaining/10:.1f}s remaining... ")
        sys.stdout.flush()
        time.sleep(0.1)
    print("\r✅ API window clear. Moving to next pass.                   \n")
