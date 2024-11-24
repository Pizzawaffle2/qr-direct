// File: src/app/profile/api-keys.tsx
'use client';

import {useState } from 'react';
import {Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {Button } from '@/components/ui/button';
import {Input } from '@/components/ui/input';
import {useToast } from '@/components/ui/use-toast';
import {Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Key, Copy, Trash2, Plus, AlertTriangle, Loader2 } from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
}

export function APIKeys() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const { toast } = useToast();

  const createNewKey = async () => {
    try {
      setIsCreating(true);
      const response = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName }),
      });

      if (!response.ok) throw new Error('Failed to create API key');

      const newKey = await response.json();
      setApiKeys((prev) => [...prev, newKey]);
      setNewKeyName('');

      toast({
        title: 'API Key Created',
        description: 'Your new API key has been generated successfully.',
      });
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to create API key',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const deleteKey = async (id: string) => {
    try {
      setIsLoading(true);
      await fetch(`/api/user/api-keys/${id}`, {
        method: 'DELETE',
      });

      setApiKeys((prev) => prev.filter((key) => key.id !== id));

      toast({
        title: 'API Key Deleted',
        description: 'The API key has been deleted successfully.',
      });
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to delete API key',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'API key copied to clipboard&apos;,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>Manage your API keys for accessing the QR Direct API</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
                <DialogDescription>Enter a name for your new API key</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input
                  placeholder="API Key Name"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
                <Button
                  onClick={createNewKey}
                  disabled={!newKeyName || isCreating}
                  className="w-full"
                >
                  {isCreating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Key className="mr-2 h-4 w-4" />
                  )}
                  Generate API Key
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>{key.name}</TableCell>
                    <TableCell>
                      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                        {key.key.slice(0, 8)}...{key.key.slice(-8)}
                      </code>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(key.key)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>{new Date(key.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : &apos;Never'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteKey(key.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {apiKeys.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No API keys found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            <p>API keys are sensitive. Never share them or commit them to version control.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
